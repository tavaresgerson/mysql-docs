#### 2.3.4.7 Customizando o PATH para Ferramentas MySQL

Aviso

Você deve ter extremo cuidado ao editar manualmente o `PATH` do seu sistema; a exclusão acidental ou modificação de qualquer porção do valor `PATH` existente pode resultar em um sistema com mau funcionamento ou até mesmo inutilizável.

Para facilitar a invocação de programas MySQL, você pode adicionar o nome do caminho do diretório `bin` do MySQL à sua variável de ambiente `PATH` do sistema Windows:

* Na área de trabalho do Windows, clique com o botão direito no ícone Meu Computador (My Computer) e selecione Propriedades (Properties).

* Em seguida, selecione a aba Avançado (Advanced) no menu Propriedades do Sistema (System Properties) que aparece e clique no botão Variáveis de Ambiente (Environment Variables).

* Em Variáveis do Sistema (System Variables), selecione Path e, em seguida, clique no botão Editar (Edit). O diálogo Editar Variável do Sistema (Edit System Variable) deve aparecer.

* Posicione o cursor no final do texto que aparece no espaço marcado como Valor da Variável (Variable Value). (Use a tecla **End** para garantir que seu cursor esteja posicionado no final absoluto do texto neste espaço.) Em seguida, insira o nome do caminho completo do seu diretório `bin` do MySQL (por exemplo, `C:\Program Files\MySQL\MySQL Server 5.7\bin`)

  Nota

  Deve haver um ponto e vírgula separando este path de quaisquer valores presentes neste campo.

Feche este diálogo e cada diálogo seguinte, clicando em OK até que todos os diálogos abertos tenham sido dispensados. O novo valor `PATH` deve agora estar disponível para qualquer novo *command shell* que você abrir, permitindo que você invoque qualquer programa executável do MySQL digitando seu nome no *prompt* do DOS a partir de qualquer diretório no sistema, sem a necessidade de fornecer o *path*. Isso inclui os *servers*, o `client` **mysql** e todos os utilitários de linha de comando MySQL, como **mysqladmin** e **mysqldump**.

Você não deve adicionar o diretório `bin` do MySQL ao seu `PATH` do Windows se estiver executando múltiplos *servers* MySQL na mesma máquina.