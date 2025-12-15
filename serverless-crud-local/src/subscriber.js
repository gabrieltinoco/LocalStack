module.exports.handler = async (event) => {
    // O evento vem do SNS
    for (const record of event.Records) {
        const message = record.Sns.Message;
        console.log(`[SNS NOTIFICATION RECEIVED]: ${message}`);
        // Aqui você poderia mandar um email, salvar log, etc.
    }
    return;
};