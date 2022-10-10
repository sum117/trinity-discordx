export enum ErrorMessage {
  AlreadyLiked = "Você já deu like nesse personagem.",
  CharacterInvalidImage = "A imagem do(a) seu/sua personagem não é válida.",
  CharacterInvalidName = "O nome do(a) seu/sua personagem não é válido.",
  CharacterNotCreated = "Seu/sua personagem não pôde ser criado(a).",
  CharacterNotFound = "Seu/sua personagem não pôde ser encontrado(a).",
  Color = "Por favor insira uma cor válida. Ela deve conter # no começo e 6 caracteres hexadecimais.",
  ColorImage = "Por favor insira uma cor válida e uma imagem válida. A cor deve conter # no começo e 6 caracteres hexadecimais. A imagem deve ser um link direto para a imagem.",
  DatabaseError = "Ocorreu um erro no banco de dados. Entre no servidor de suporte e reporte o erro se você acreditar que ele é um bug.",
  FetchError = "Ocorreu um erro ao buscar a mensagem. ",
  Image = "Por favor insira um link de imagem válido. Ela deve conter http(s):// no começo e terminar com .jpg, .png ou .gif.",
  Music = "Por favor insira um link do youtube válido.",
  NoEditContent = "Você não forneceu um conteúdo para editar a mensagem.",
  NotPostOwner = "Você não é o(a) dono(a) da mensagem ou ela não é elegível para ser deletada. Não é possível deletá-la ou editá-la.",
  Prefix = "O prefixo do(a) seu/sua personagem já existe em algum outro personagem seu.",
  UnknownChannel = "Incapaz de encontrar o canal da mensagem. Verifique se o canal ainda existe.",
  CannotLikeMessage = "Você não pode dar like em uma mensagem.",
  UnknownMessage = "Incapaz de deletar ou editar a mensagem inexistente.",
}

export enum Feedback {
  Bite = "**{user} mordeu {target}**\n{target} foi mordido(a) {counter} vezes.",
  CharacterCreated = "Seu/Sua personagem foi criado com sucesso.",
  CharacterDeleted = "Seu/Sua personagem foi excluído com sucesso.",
  CharacterLiked = "❤️ Você deu uma curtida neste personagem!",
  CharacterUpdateMenu = "Atualizando o(a) personagem de {character} de {user}.",
  CharacterUpdated = "Seu/Sua personagem foi atualizado com sucesso.",
  DisplayProfile = "Exibindo perfil do(a) personagem {character} de {user}.",
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
  Create = "Cria um personagem.",
  Delete = "Delete um post do playcard.",
  DeleteCharOption = "Personagem que você deseja deletar.",
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
  ManagePlaycard = "Comandos de gerenciamento dos personagens.",
  Playcard = "Comandos relacionados ao sistema de personagens.",
  Profile = "Mostra o perfil de um personagem.",
  ProfileCharOption = "Personagem que você deseja ver o perfil.",
  Update = "Atualiza um personagem.",
  UpdateCharOption = "Personagem que você deseja atualizar.",
  Help = 'Obtenha a lista de comandos do Trinity.'
}

export enum CharEmbedField {
  CreatedAt = "Criado",
  LetterCount = "Total de Caracteres",
  Likes = "Curtidas",
  Music = "Link da música",
  Name = "Nome",
  Posts = "Quantia de Posts",
  Title = "Título",
}
export enum HelpEmbed {
  Title = 'Comandos do Trinity',
  Roleplay = "Para usar seu personagem simplesmente use seu prefixo com um `:` após ele e o texto logo em seguida. É possível utilizar vários personagens em uma mensagem só.\n\nExemplo: `fulano: olá, mundo!`",
  FooterText = "❤️ Um bot feito com muito amor por um desenvolvedor apaixonado por fantasia.",
  Color = "#36393e"
}
export enum TrinityModalTitle {
  CreateChar = "Criar Personagem",
  UpdateChar = "Atualizar Personagem",
}
export enum CharModalLabel {
  Color = "Cor",
  Description = "Descrição",
  Image = "Imagem",
  Music = "Música",
  Name = "Nome",
  Prefix = "Prefixo",
  Title = "Título",
  TitleIcon = "Ícone do Título",
}
export enum CharModalPlaceholder {
  Color = "Cor do personagem em hexadecimal, com o #",
  Description = "Descrição do personagem",
  Image = "Link da imagem do personagem",
  Name = "Nome do personagem",
  Prefix = "Prefixo do personagem",
}

export enum CharUpdateModalPlaceholder {
  Color = "A nova cor do personagem em hexadecimal, com o #",
  Description = "Uma nova descrição para o personagem",
  Image = "Novo link da imagem do personagem",
  Music = "Um novo link do youtube para a música",
  Name = "Nome do personagem a ser atualizado",
  Prefix = "Prefixo do personagem a ser atualizado",
  Title = "Título do personagem a ser atualizado",
  TitleIcon = "Link da imagem do título a ser atualizado",
}
export enum CharUpdateButtonLabel {
  Color = "Cor do Embed",
  Description = "Descrição",
  Image = "Imagem",
  Music = "Música",
  Name = "Nome",
  Prefix = "Prefixo",
  Title = "Título",
}

export enum CharLikeButton {
  Emoji = "👍",
  Like = "Curtir",
}
