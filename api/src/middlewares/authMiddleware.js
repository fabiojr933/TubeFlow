module.exports = function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            status: 401,
            resultado: 'falha',
            erro: 'Token é obrigatório!'
        });
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
        return res.status(401).json({
            status: 401,
            resultado: 'falha',
            erro: 'Token mal formatado!'
        });
    }
    
    try {
        if (token == process.env.JWT_SECRET) {
            return next();
        } else {
            return res.status(401).json({
                status: 401,
                resultado: 'falha',
                erro: 'Token inválido ou expirado!'
            });
        }

    } catch (error) {
        return res.status(401).json({
            status: 401,
            resultado: 'falha',
            erro: 'Token inválido ou expirado!'
        });
    }
};
