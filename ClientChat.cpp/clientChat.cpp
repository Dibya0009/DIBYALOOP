#include <iostream>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <thread>

#pragma comment(lib, "ws2_32.lib")
#define PORT 54000

void receiveMessages(SOCKET socket) {
    char buffer[1024];
    int bytesReceived;

    while ((bytesReceived = recv(socket, buffer, sizeof(buffer), 0)) > 0) {
        std::cout << ">> " << std::string(buffer, bytesReceived);
    }

    std::cout << "Disconnected from server.\n";
}

int main() {
    WSADATA wsaData;
    WSAStartup(MAKEWORD(2,2), &wsaData);

    SOCKET clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in server = {};
    server.sin_family = AF_INET;
    server.sin_port = htons(PORT);
    inet_pton(AF_INET, "127.0.0.1", &server.sin_addr);

    connect(clientSocket, (sockaddr*)&server, sizeof(server));
    std::cout << "Connected to chat server.\n";

    std::thread(receiveMessages, clientSocket).detach();

    std::string input;
    while (getline(std::cin, input)) {
        send(clientSocket, input.c_str(), input.size(), 0);
    }

    closesocket(clientSocket);
    WSACleanup();
    return 0;
}
