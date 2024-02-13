// src/services/progress.service.js
let clients = {};

// 클라이언트 추가 및 연결 종료 처리
const addClient = (clientId, res) => {
    clients[clientId] = res;

    res.on('close', () => {
        delete clients[clientId];
    });
};

// 진행 상태 업데이트
const sendProgress = (clientId, status, percentage) => {
    const client = clients[clientId];
    if(client) {
        client.write(`data: ${JSON.stringify({ status, percentage })}\n\n`);
    }
};

export { addClient, sendProgress };
