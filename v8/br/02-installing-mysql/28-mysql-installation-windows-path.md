#### 2.3.3.7 Personalização do PATH para ferramentas MySQL

Advertência

Você deve ter muito cuidado ao editar seu sistema `PATH` manualmente; a exclusão ou modificação acidental de qualquer parte do valor existente `PATH` pode deixá-lo com um sistema com mau funcionamento ou mesmo inutilizável.

Para facilitar a invocação de programas MySQL, você pode adicionar o nome do caminho do diretório MySQL `bin` à variável de ambiente do sistema Windows `PATH`:

- Na área de trabalho do Windows, clique com o botão direito do mouse no ícone Meu computador e selecione Propriedades.
- Em seguida, selecione a guia Avançado no menu Propriedades do Sistema que aparece, e clique no botão Variaveis de Ambiente.
- Em Variáveis do Sistema, selecione Caminho e, em seguida, clique no botão Editar. O diálogo Editar Variável do Sistema deve aparecer.
- Coloque seu cursor no final do texto que aparece no espaço marcado Valor variável. (Use a tecla **End** para garantir que seu cursor esteja posicionado no final do texto neste espaço.) Em seguida, insira o nome completo do caminho do seu diretório MySQL `bin` (por exemplo, `C:\Program Files\MySQL\MySQL Server 8.4\bin`)

  ::: info Note

  Deve haver um ponto e vírgula que separe este caminho de quaisquer valores presentes neste campo.

  :::

  Descarte este diálogo, e cada diálogo por sua vez, clicando em OK até que todos os diálogos que foram abertos tenham sido descartados. O novo valor `PATH` deve agora estar disponível para qualquer novo shell de comando que você abrir, permitindo que você invoque qualquer programa executável do MySQL digitando seu nome no prompt do DOS de qualquer diretório no sistema, sem ter que fornecer o caminho. Isso inclui os servidores, o cliente `mysql` e todos os utilitários de linha de comando do MySQL, como `mysqladmin` e `mysqldump`.

Você não deve adicionar o diretório MySQL `bin` ao seu Windows `PATH` se estiver executando vários servidores MySQL na mesma máquina.
