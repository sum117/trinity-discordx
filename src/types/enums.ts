export enum ErrorMessage {
  CharacterInvalidImage = "A imagem do(a) seu/sua personagem não é válida.",
  CharacterInvalidName = "O nome do(a) seu/sua personagem não é válido.",
  CharacterNotCreated = "Seu/sua personagem não pôde ser criado(a).",
  CharacterNotFound = "Seu/sua personagem não pôde ser encontrado(a).",
  DatabaseError = "Ocorreu um erro no banco de dados. Entre no servidor de suporte e reporte o erro se você acreditar que ele é um bug.",
}

export enum Feedback {
  CharacterCreated = "Seu personagem foi criado com sucesso.",
  CharacterDeleted = "Seu personagem foi excluído com sucesso.",
  CharacterUpdated = "Seu personagem foi atualizado com sucesso.",
  Hug = "**{user} abraçou {target}**\n{target} foi abraçado(a) {counter} vezes.",
  PostDeleted = "Seu post foi excluído com sucesso.",
  PostUpdated = "Seu post foi atualizado com sucesso.",
}

export enum CommandInfo {
  Avatar = "Mostra a imagem de perfil de um usuário.",
  AvatarOption = "Usuário que você deseja ver a imagem de perfil.",
  Interact = "Comandos de interação.",
  InteractHug = "Abraça um usuário.",
  InteractUserOption = "Usuário que você deseja interagir.",
}
