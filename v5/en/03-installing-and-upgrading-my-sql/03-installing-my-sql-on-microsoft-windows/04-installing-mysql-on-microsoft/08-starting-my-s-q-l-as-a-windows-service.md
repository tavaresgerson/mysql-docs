#### 2.3.4.8 Iniciando o MySQL como um Windows Service

No Windows, a maneira recomendada de executar o MySQL é instalá-lo como um Windows Service, para que o MySQL inicie e pare automaticamente quando o Windows iniciar e parar. Um servidor MySQL instalado como um Service também pode ser controlado pela Command Line usando comandos **NET**, ou com o utilitário gráfico **Services**. Geralmente, para instalar o MySQL como um Windows Service, você deve estar logado usando uma conta que tenha direitos de administrador.

O utilitário **Services** (o Windows **Service Control Manager**) pode ser encontrado no Painel de Controle do Windows. Para evitar conflitos, é aconselhável fechar o utilitário **Services** enquanto realiza operações de instalação ou remoção de servidor pela Command Line.

##### Instalando o Service

Antes de instalar o MySQL como um Windows Service, você deve primeiro parar o servidor atual, se ele estiver em execução, usando o seguinte comando:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqladmin"
          -u root shutdown
```

Nota

Se a conta de usuário `root` do MySQL tiver uma senha, você precisará invocar o **mysqladmin** com a opção `-p` e fornecer a senha quando solicitado.

Este comando invoca o utilitário administrativo **mysqladmin** do MySQL para conectar-se ao servidor e instruí-lo a desligar (shut down). O comando se conecta como o usuário `root` do MySQL, que é a conta administrativa padrão no grant system do MySQL.

Nota

Os usuários no grant system do MySQL são totalmente independentes de quaisquer usuários do sistema operacional no Windows.

Instale o servidor como um Service usando este comando:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --install
```

O comando de instalação do Service não inicia o servidor. As instruções para isso são fornecidas mais adiante nesta seção.

Para facilitar a invocação de programas MySQL, você pode adicionar o nome do path do diretório `bin` do MySQL à sua variável de ambiente `PATH` do sistema Windows:

* Na área de trabalho do Windows, clique com o botão direito no ícone Meu Computador e selecione Propriedades.

* Em seguida, selecione a aba Avançado no menu Propriedades do Sistema que aparece e clique no botão Variáveis de Ambiente.

* Em Variáveis do Sistema, selecione Path e clique no botão Editar. A caixa de diálogo Editar Variável do Sistema deve aparecer.

* Coloque o cursor no final do texto que aparece no espaço marcado como Valor da Variável. (Use a tecla **End** para garantir que seu cursor esteja posicionado no final absoluto do texto neste espaço.) Em seguida, insira o nome completo do path do seu diretório `bin` do MySQL (por exemplo, `C:\Program Files\MySQL\MySQL Server 5.7\bin`), e deve haver um ponto e vírgula separando este path de quaisquer valores presentes neste campo. Feche esta caixa de diálogo, e cada caixa de diálogo subsequente, clicando em OK até que todas as caixas de diálogo que foram abertas tenham sido fechadas. Agora você deve ser capaz de invocar qualquer programa executável do MySQL digitando seu nome no prompt do DOS a partir de qualquer diretório do sistema, sem ter que fornecer o path. Isso inclui os servidores, o cliente **mysql** e todos os utilitários de Command Line do MySQL, como **mysqladmin** e **mysqldump**.

  Você não deve adicionar o diretório `bin` do MySQL ao seu `PATH` do Windows se estiver executando múltiplos servidores MySQL na mesma máquina.

Aviso

Você deve ter muito cuidado ao editar manualmente seu `PATH` do sistema; a exclusão ou modificação acidental de qualquer parte do valor `PATH` existente pode deixar seu sistema com mau funcionamento ou até mesmo inutilizável.

Os seguintes argumentos adicionais podem ser usados ao instalar o Service:

* Você pode especificar um nome de Service imediatamente após a opção `--install`. O nome de Service padrão é `MySQL`.

* Se um nome de Service for fornecido, ele pode ser seguido por uma única opção. Por convenção, esta deve ser `--defaults-file=file_name` para especificar o nome de um option file a partir do qual o servidor deve ler as opções quando iniciar.

  O uso de uma única opção diferente de `--defaults-file` é possível, mas desencorajado. `--defaults-file` é mais flexível porque permite especificar múltiplas opções de startup para o servidor, colocando-as no option file nomeado.

* Você também pode especificar uma opção `--local-service` após o nome do Service. Isso faz com que o servidor seja executado usando a conta Windows `LocalService`, que possui privilégios de sistema limitados. Se `--defaults-file` e `--local-service` forem fornecidos após o nome do Service, eles podem estar em qualquer ordem.

Para um servidor MySQL que é instalado como um Windows Service, as seguintes regras determinam o nome do Service e os option files que o servidor utiliza:

* Se o comando de instalação do Service não especificar um nome de Service ou especificar o nome de Service padrão (`MySQL`) após a opção `--install`, o servidor usa o nome de Service `MySQL` e lê as opções do grupo `[mysqld]` nos option files padrão.

* Se o comando de instalação do Service especificar um nome de Service diferente de `MySQL` após a opção `--install`, o servidor usa esse nome de Service. Ele lê as opções do grupo `[mysqld]` e do grupo que tem o mesmo nome do Service nos option files padrão. Isso permite que você use o grupo `[mysqld]` para opções que devem ser usadas por todos os Services MySQL, e um grupo de opções com o nome do Service para uso pelo servidor instalado com esse nome de Service.

* Se o comando de instalação do Service especificar uma opção `--defaults-file` após o nome do Service, o servidor lê as opções da mesma forma descrita no item anterior, exceto que ele lê as opções apenas do arquivo nomeado e ignora os option files padrão.

Como um exemplo mais complexo, considere o seguinte comando:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld"
          --install MySQL --defaults-file=C:\my-opts.cnf
```

Aqui, o nome de Service padrão (`MySQL`) é fornecido após a opção `--install`. Se nenhuma opção `--defaults-file` tivesse sido fornecida, este comando teria o efeito de fazer com que o servidor lesse o grupo `[mysqld]` dos option files padrão. No entanto, como a opção `--defaults-file` está presente, o servidor lê as opções do grupo de opções `[mysqld]`, e apenas do arquivo nomeado.

Nota

No Windows, se o servidor for iniciado com as opções `--defaults-file` e `--install`, `--install` deve vir primeiro. Caso contrário, `mysqld.exe` tentará iniciar o servidor MySQL.

Você também pode especificar opções como parâmetros de Start no utilitário **Services** do Windows antes de iniciar o Service MySQL.

Finalmente, antes de tentar iniciar o Service MySQL, certifique-se de que as variáveis de usuário `%TEMP%` e `%TMP%` (e também `%TMPDIR%`, se tiver sido definida) para o usuário do sistema operacional que executará o Service estejam apontando para uma pasta à qual o usuário tem acesso de escrita (write access). O usuário padrão para executar o Service MySQL é `LocalSystem`, e o valor padrão para seu `%TEMP%` e `%TMP%` é `C:\Windows\Temp`, um diretório ao qual `LocalSystem` tem acesso de escrita por padrão. No entanto, se houver quaisquer alterações nessa configuração padrão (por exemplo, alterações no usuário que executa o Service ou nas variáveis de usuário mencionadas, ou se a opção `--tmpdir` foi usada para colocar o diretório temporário em outro lugar), o Service MySQL pode falhar ao ser executado porque o acesso de escrita ao diretório temporário não foi concedido ao usuário adequado.

##### Iniciando o Service

Depois que uma instância do servidor MySQL é instalada como um Service, o Windows inicia o Service automaticamente sempre que o Windows é iniciado. O Service também pode ser iniciado imediatamente a partir do utilitário **Services**, ou usando um comando **sc start *`mysqld_service_name`*** ou **NET START *`mysqld_service_name`***. Os comandos **SC** e **NET** não diferenciam maiúsculas de minúsculas (case-sensitive).

Quando executado como um Service, o **mysqld** não tem acesso a uma janela de console, portanto, nenhuma mensagem pode ser vista lá. Se o **mysqld** não iniciar, verifique o error log para ver se o servidor escreveu alguma mensagem indicando a causa do problema. O error log está localizado no data directory do MySQL (por exemplo, `C:\Program Files\MySQL\MySQL Server 5.7\data`). É o arquivo com o sufixo `.err`.

Quando um servidor MySQL foi instalado como um Service, e o Service está em execução, o Windows interrompe o Service automaticamente quando o Windows é desligado (shuts down). O servidor também pode ser parado manualmente usando o utilitário `Services`, o comando **sc stop *`mysqld_service_name`***, o comando **NET STOP *`mysqld_service_name`***, ou o comando **mysqladmin shutdown**.

Você também tem a opção de instalar o servidor como um Service manual se não desejar que o Service seja iniciado automaticamente durante o processo de boot. Para fazer isso, use a opção `--install-manual` em vez da opção `--install`:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --install-manual
```

##### Removendo o Service

Para remover um servidor que está instalado como um Service, primeiro pare-o se estiver em execução, executando **SC STOP *`mysqld_service_name`*** ou **NET STOP *`mysqld_service_name`***. Em seguida, use **SC DELETE *`mysqld_service_name`*** para removê-lo:

```sql
C:\> SC DELETE mysql
```

Alternativamente, use a opção `--remove` do **mysqld** para remover o Service.

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --remove
```

Se o **mysqld** não estiver rodando como um Service, você pode iniciá-lo pela Command Line. Para instruções, veja a Seção 2.3.4.6, “Iniciando o MySQL pela Command Line do Windows”.

Se você encontrar dificuldades durante a instalação, veja a Seção 2.3.5, “Solucionando Problemas em uma Instalação do MySQL Server no Microsoft Windows”.

Para mais informações sobre como parar ou remover um Windows Service, veja a Seção 5.7.2.2, “Iniciando Múltiplas Instâncias do MySQL como Windows Services”.