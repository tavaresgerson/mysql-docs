#### 2.3.4.7 Personalizar o caminho para as ferramentas do MySQL

Aviso

Você deve ter muito cuidado ao editar seu sistema manualmente `PATH`; a exclusão ou modificação acidental de qualquer parte do valor existente de `PATH` pode deixar o sistema com mau funcionamento ou até mesmo inutilizável.

Para facilitar o uso de programas do MySQL, você pode adicionar o nome do caminho do diretório MySQL `bin` à sua variável de ambiente do sistema Windows `PATH`:

- No desktop do Windows, clique com o botão direito no ícone Meu Computador e selecione Propriedades.

- Em seguida, selecione a guia Avançado do menu Propriedades do sistema e clique no botão Variáveis de ambiente.

- Em Variáveis do sistema, selecione Caminho e, em seguida, clique no botão Editar. O diálogo Editar variável do sistema deve aparecer.

- Coloque o cursor no final do texto que aparece no espaço marcado Valor da variável. (Use a tecla **Final** para garantir que o cursor esteja posicionado no final do texto neste espaço.) Em seguida, insira o nome completo do caminho do diretório MySQL `bin` (por exemplo, `C:\Program Files\MySQL\MySQL Server 8.0\bin`)

  Nota

  Deve haver um ponto e vírgula separando este caminho de quaisquer valores presentes neste campo.

  Desative este diálogo e, em seguida, desative cada diálogo clicando em OK até que todos os diálogos abertos sejam desativados. O novo valor `PATH` deve estar disponível para qualquer novo prompt de comando que você abrir, permitindo que você invoque qualquer programa executável do MySQL digitando seu nome no prompt do DOS a partir de qualquer diretório do sistema, sem precisar fornecer o caminho. Isso inclui os servidores, o cliente **mysql** e todos os utilitários de linha de comando do MySQL, como **mysqladmin** e **mysqldump**.

Você não deve adicionar o diretório MySQL `bin` ao seu Windows `PATH` se estiver executando vários servidores MySQL na mesma máquina.
