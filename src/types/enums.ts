export enum ErrorMessage {
  CharacterInvalidImage = "A imagem do(a) seu/sua personagem não é válida.",
  CharacterInvalidName = "O nome do(a) seu/sua personagem não é válido.",
  CharacterNotCreated = "Seu/sua personagem não pôde ser criado(a).",
  CharacterNotFound = "Seu/sua personagem não pôde ser encontrado(a).",
  DatabaseError = "Ocorreu um erro no banco de dados. Entre no servidor de suporte e reporte o erro se você acreditar que ele é um bug.",
}

export enum Feedback {
  Bite = "**{user} mordeu {target}**\n{target} foi mordido(a) {counter} vezes.",
  CharacterCreated = "Seu/Sua personagem foi criado com sucesso.",
  CharacterDeleted = "Seu/Sua personagem foi excluído com sucesso.",
  CharacterUpdated = "Seu/Sua personagem foi atualizado com sucesso.",
  Hug = "**{user} abraçou {target}**\n{target} foi abraçado(a) {counter} vezes.",
  Kiss = "**{user} beijou {target}**\n{target} foi beijado(a) {counter} vezes.",
  PostDeleted = "Seu post foi excluído com sucesso.",
  PostUpdated = "Seu post foi atualizado com sucesso.",
  Punch = "**{user} deu um soco em {target}**\n{target} foi socado(a) {counter} vezes.",
  Slap = "**{user} deu um tapa em {target}**\n{target} levou um tapa {counter} vezes.",
}

export enum CommandInfo {
  Avatar = "Mostra a imagem de perfil de um(a) usuário(a).",
  AvatarOption = "Usuário(a) que você deseja ver a imagem de perfil.",
  Interact = "Comandos de interação.",
  InteractBite = "Morda um(a) usuário(a).",
  InteractHug = "Abraça um(a) usuário(a).",
  InteractKiss = "Beija um(a) usuário(a).",
  InteractPunch = "Da um tapa em um(a) usuário(a).",
  InteractSlap = "Dá um tapa em um(a) usuário(a).",
  InteractUserOption = "Usuário(a) que você deseja interagir.",
}

export enum CharEmbedField {
  CreatedAt = "Criado em",
  LetterCount = "Total de Caracteres",
  Name = "Nome",
  Posts = "Quantia de Posts",
  Title = "Título",
}
