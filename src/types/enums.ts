export enum ErrorMessage {
  CharacterInvalidImage = "A imagem do(a) seu/sua personagem não é válida.",
  CharacterInvalidName = "O nome do(a) seu/sua personagem não é válido.",
  CharacterNotCreated = "Seu/sua personagem não pôde ser criado(a).",
  CharacterNotFound = "Seu/sua personagem não pôde ser encontrado(a).",
  DatabaseError = "Ocorreu um erro no banco de dados. Entre no servidor de suporte e reporte o erro se você acreditar que ele é um bug.",
  FetchError = "Ocorreu um erro ao buscar a mensagem. ",
  NoEditContent = "Você não forneceu um conteúdo para editar a mensagem.",
  NotPostOwner = "Você não é o(a) dono(a) da mensagem ou ela não é elegível para ser deletada. Não é possível deletá-la ou editá-la.",
  UnknownChannel = "Incapaz de encontrar o canal da mensagem. Verifique se o canal ainda existe.",
  UnknownMessage = "Incapaz de deletar ou editar a mensagem inexistente.",
}

export enum Feedback {
  Bite = "**{user} mordeu {target}**\n{target} foi mordido(a) {counter} vezes.",
  CharacterCreated = "Seu/Sua personagem foi criado com sucesso.",
  CharacterDeleted = "Seu/Sua personagem foi excluído com sucesso.",
  CharacterUpdated = "Seu/Sua personagem foi atualizado com sucesso.",
  Hug = "**{user} abraçou {target}**\n{target} foi abraçado(a) {counter} vezes.",
  Kiss = "**{user} beijou {target}**\n{target} foi beijado(a) {counter} vezes.",
  MessageEditted = "Mensagem editada com sucesso.",
  PostDeleted = "Seu post foi excluído com sucesso.",
  PostUpdated = "Seu post foi atualizado com sucesso.",
  Punch = "**{user} deu um soco em {target}**\n{target} foi socado(a) {counter} vezes.",
  Slap = "**{user} deu um tapa em {target}**\n{target} levou um tapa {counter} vezes.",
}

export enum CommandInfo {
  Avatar = "Mostra a imagem de perfil de um(a) usuário(a).",
  AvatarOption = "Usuário(a) que você deseja ver a imagem de perfil.",
  Delete = "Delete um post do playcard.",
  DeleteMessageOption = "Id da mensagem que você deseja deletar.",
  Edit = "Edita um post do playcard.",
  EditContent = "Novo conteúdo do Post.",
  EditMessageOption = "Id da mensagem que você deseja editar.",
  Interact = "Comandos de interação.",
  InteractBite = "Morda um(a) usuário(a).",
  InteractHug = "Abraça um(a) usuário(a).",
  InteractKiss = "Beija um(a) usuário(a).",
  InteractPunch = "Da um tapa em um(a) usuário(a).",
  InteractSlap = "Dá um tapa em um(a) usuário(a).",
  InteractUserOption = "Usuário(a) que você deseja interagir.",
  Playcard = "Comandos relacionados ao sistema de personagens.",
}

export enum CharEmbedField {
  CreatedAt = "Criado em",
  LetterCount = "Total de Caracteres",
  Music = "Link da música",
  Name = "Nome",
  Posts = "Quantia de Posts",
  Title = "Título",
}
