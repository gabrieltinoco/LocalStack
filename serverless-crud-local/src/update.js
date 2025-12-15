const AWS = require('aws-sdk');

const endpoint = process.env.LOCALSTACK_HOSTNAME
    ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566`
    : 'http://localhost:4566';

const dynamoDb = new AWS.DynamoDB.DocumentClient({ endpoint });
const sns = new AWS.SNS({ endpoint });

module.exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { name, description } = body;
        const timestamp = new Date().toISOString();

        // Validação Obrigatória (Requisito do Trabalho)
        if (!name || !description) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Nome e descrição são obrigatórios para atualização" })
            };
        }

        const params = {
            TableName: process.env.TABLE_NAME,
            Key: {
                id: event.pathParameters.id,
            },
            // Sintaxe do DynamoDB para atualizar campos específicos
            ExpressionAttributeNames: {
                '#item_name': 'name',
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':description': description,
                ':updatedAt': timestamp,
            },
            UpdateExpression: 'SET #item_name = :name, description = :description, updatedAt = :updatedAt',
            ReturnValues: 'ALL_NEW', // Retorna o item já atualizado
        };

        const result = await dynamoDb.update(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao atualizar item" }),
        };
    }
};