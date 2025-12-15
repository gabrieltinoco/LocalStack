const AWS = require('aws-sdk');

// Configuração para apontar para o LocalStack
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:4566',
    region: 'us-east-1'
});

module.exports.handler = async (event) => {
    try {
        const params = {
            TableName: process.env.TABLE_NAME,
        };

        const result = await dynamoDb.scan(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao listar itens" }),
        };
    }
};