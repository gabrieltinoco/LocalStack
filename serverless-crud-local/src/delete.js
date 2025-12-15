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
                id: event.pathParameters.id,
            },
        };

        await dynamoDb.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Item removido com sucesso!" }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao deletar item" }),
        };
    }
};