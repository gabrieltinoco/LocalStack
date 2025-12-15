const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:4566',
    region: 'us-east-1'
});

module.exports.handler = async (event) => {
    try {
        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                id: event.pathParameters.id, // Pega o ID da URL
            },
        };

        const result = await dynamoDb.get(params).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Item não encontrado" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao buscar item" }),
        };
    }
};