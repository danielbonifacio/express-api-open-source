module.exports = {
  Application: {
    Port: 'expressAPI está rodando na porta:'
  },
  DataBase: {
    ConnectError: 'Erro ao conectar com o banco de dados.',
    StoreError: 'Erro ao salvar no banco de dados.',
    NotFound: 'Nada encontrado.',
    Stored: 'Salvo com sucesso.',
    Updated: 'Atualizado com sucesso.',
    Deleted: 'Deletado com sucesso.',
    Exists: 'Já cadastrado no banco de dados.'
  },
  Server: {
    Fail: 'Falha ao processar solicitação.',
    Error: 'Erro ao processar solicitação.'
  },
  Auth: {
    Forbidden: 'Acesso negado.',
    Unauthorized: 'Não tem permissão.',
    Expired: 'Token expirado.',
    Valid: 'Token válido.',
    Invalid: 'Token inválido.',
    Logged: 'Logado com sucesso.',
    TokenNotProvided: 'Nenhum token providenciado.',
    TokenError: 'Erro no Token.',
    TokenMalformatted: 'Token mal formatado'
  },
  PasswordRecover: {
    EmailFailed: 'Não foi possível enviar o email de recuperação de senha.' 
  }
}