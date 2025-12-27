#### 2.3.3.8 Iniciar o MySQL como um serviço do Windows

No Windows, a maneira recomendada de executar o MySQL é instalá-lo como um serviço do Windows, para que ele inicie e pare automaticamente quando o Windows iniciar e parar. Um servidor MySQL instalado como serviço também pode ser controlado a partir da linha de comando usando comandos **NET**, ou com o utilitário gráfico **Serviços**. Geralmente, para instalar o MySQL como um serviço do Windows, você deve estar logado usando uma conta que tenha direitos de administrador.

O utilitário **Serviços** (o **Gerenciador de Controle de Serviços** do Windows) pode ser encontrado no Painel de Controle do Windows. Para evitar conflitos, é aconselhável fechar o utilitário **Serviços** enquanto realiza operações de instalação ou remoção do servidor a partir da linha de comando.

##### Instalando o serviço

Antes de instalar o MySQL como um serviço do Windows, você deve primeiro parar o servidor atual, se ele estiver em execução, usando o seguinte comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysqladmin"
          -u root shutdown
```

Observação

Se a conta de usuário `root` do MySQL tiver uma senha, você precisa invocar o **mysqladmin** com a opção `-p` e fornecer a senha quando solicitado.

Este comando invoca o utilitário administrativo do MySQL **mysqladmin** para se conectar ao servidor e dizer-lhe para desligar. O comando se conecta como o usuário `root` do MySQL, que é a conta administrativa padrão no sistema de concessão do MySQL.

Observação

Os usuários no sistema de concessão do MySQL são totalmente independentes de quaisquer usuários do sistema operacional no Windows.

Instale o servidor como um serviço usando este comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysqld" --install
```

O comando de instalação do serviço não inicia o servidor. As instruções para isso são fornecidas mais adiante nesta seção.

Para facilitar o invocação de programas do MySQL, você pode adicionar o nome do caminho do diretório `bin` do MySQL à sua variável de ambiente **PATH** do Windows:

* No desktop do Windows, clique com o botão direito no ícone Meu Computador e selecione Propriedades.

* Em seguida, selecione a guia Avançado no menu Propriedades do Sistema e clique no botão Variáveis de Ambiente.

* Na seção Variáveis do Sistema, selecione Caminho e, em seguida, clique no botão Editar. O diálogo Editar Variável do Sistema deve aparecer.

* Posicione o cursor no final do texto que aparece no espaço marcado Valor da Variável. (Use a tecla **End** para garantir que o cursor esteja posicionado no final do texto neste espaço.) Em seguida, insira o nome completo do diretório `bin` do MySQL (por exemplo, `C:\Program Files\MySQL\MySQL Server 9.5\bin`), e deve haver um ponto e vírgula separando este caminho de quaisquer valores presentes neste campo. Fechar este diálogo e, em seguida, cada diálogo, clicando em OK até que todos os diálogos abertos tenham sido fechados. Agora você deve ser capaz de invocar qualquer programa executável do MySQL digitando seu nome no prompt do DOS a partir de qualquer diretório do sistema, sem precisar fornecer o caminho. Isso inclui os servidores, o cliente **mysql** e todas as ferramentas de linha de comando do MySQL, como **mysqladmin** e **mysqldump**.

Você não deve adicionar o diretório `bin` do MySQL ao seu `PATH` do Windows se estiver executando vários servidores MySQL na mesma máquina.

Aviso

Você deve ter muito cuidado ao editar manualmente o `PATH` do sistema; a exclusão acidental ou a modificação de qualquer parte do valor existente do `PATH` pode deixar o sistema com um mau funcionamento ou até mesmo inutilizável.

Os seguintes argumentos adicionais podem ser usados ao instalar o serviço:

* Você pode especificar um nome de serviço imediatamente após a opção `--install`. O nome de serviço padrão é `MySQL`.

* Se um nome de serviço for fornecido, ele pode ser seguido por uma única opção. Por convenção, isso deve ser `--defaults-file=nome_do_arquivo` para especificar o nome de um arquivo de opções a partir do qual o servidor deve ler as opções ao iniciar.

* É possível especificar uma única opção diferente de `--defaults-file`, mas isso é desaconselhado. `--defaults-file` é mais flexível porque permite que você especifique múltiplas opções de inicialização para o servidor, colocando-as no arquivo de opções nomeado.

* Você também pode especificar uma opção `--local-service` após o nome do serviço. Isso faz com que o servidor seja executado usando a conta `LocalService` do Windows, que tem privilégios de sistema limitados. Se `--defaults-file` e `--local-service` forem fornecidos após o nome do serviço, eles podem ser em qualquer ordem.

Para um servidor MySQL instalado como um serviço do Windows, as seguintes regras determinam o nome do serviço e os arquivos de opções que o servidor usa:

* Se o comando de instalação do serviço não especificar nenhum nome de serviço ou o nome de serviço padrão (`MySQL`) após a opção `--install`, o servidor usa o nome de serviço de `MySQL` e lê as opções dos arquivos de opção `[mysqld]` padrão.

* Se o comando de instalação do serviço especificar um nome de serviço diferente de `MySQL` após a opção `--install`, o servidor usa esse nome de serviço. Ele lê as opções dos arquivos de opção `[mysqld]` e do grupo que tem o mesmo nome do serviço nos arquivos de opção padrão. Isso permite que você use o grupo `[mysqld]` para opções que devem ser usadas por todos os serviços MySQL e um grupo de opções com o nome do serviço para uso pelo servidor instalado com esse nome de serviço.

* Se o comando de instalação do serviço especificar uma opção `--defaults-file` após o nome do serviço, o servidor lê as opções da mesma maneira descrita no item anterior, exceto que lê as opções apenas do arquivo nomeado e ignora os arquivos de opção padrão.

Como exemplo mais complexo, considere o seguinte comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysqld"
          --install MySQL --defaults-file=C:\my-opts.cnf
```

Aqui, o nome de serviço padrão (`MySQL`) é dado após a opção `--install`. Se nenhuma opção `--defaults-file` tivesse sido dada, este comando teria o efeito de fazer com que o servidor levasse em consideração o grupo `[mysqld]` dos arquivos de opção padrão. No entanto, como a opção `--defaults-file` está presente, o servidor lê as opções do grupo de opção `[mysqld]` e apenas do arquivo nomeado.

Observação

Em Windows, se o servidor for iniciado com as opções `--defaults-file` e `--install`, `--install` deve ser a primeira opção. Caso contrário, o `mysqld.exe` tentará iniciar o servidor MySQL.

Você também pode especificar opções como parâmetros de inicialização na ferramenta **Serviços** do Windows antes de iniciar o serviço MySQL.

Por fim, antes de tentar iniciar o serviço MySQL, certifique-se de que as variáveis de usuário `%TEMP%` e `%TMP%` (e também `%TMPDIR%`, se tiver sido definida) para o usuário do sistema operacional que executará o serviço estejam apontando para uma pasta a qual o usuário tenha acesso de escrita. O usuário padrão para executar o serviço MySQL é `LocalSystem`, e o valor padrão para suas variáveis de usuário `%TEMP%` e `%TMP%` é `C:\Windows\Temp`, um diretório que `LocalSystem` tem acesso de escrita por padrão. No entanto, se houver alterações nessa configuração padrão (por exemplo, alterações no usuário que executa o serviço ou nas variáveis de usuário mencionadas, ou se a opção `--tmpdir` foi usada para colocar o diretório temporário em outro lugar), o serviço MySQL pode não ser executado corretamente porque o acesso de escrita ao diretório temporário não foi concedido ao usuário apropriado.

##### Iniciar o serviço

Após uma instância do servidor MySQL ter sido instalada como serviço, o Windows inicia o serviço automaticamente sempre que o Windows é iniciado. O serviço também pode ser iniciado imediatamente a partir do utilitário **Serviços**, ou usando o comando **sc start *`mysqld_service_name`*** ou **NET START *`mysqld_service_name`***. Os comandos **SC** e **NET** não são case-sensitive.

Quando executado como serviço, **mysqld** não tem acesso a uma janela de console, então não é possível ver mensagens lá. Se o **mysqld** não iniciar, verifique o log de erro para ver se o servidor escreveu alguma mensagem lá para indicar a causa do problema. O log de erro está localizado no diretório de dados do MySQL (por exemplo, `C:\Program Files\MySQL\MySQL Server 9.5\data`). É o arquivo com um sufixo de `.err`.

Quando um servidor MySQL é instalado como serviço e o serviço está em execução, o Windows para o serviço automaticamente quando o Windows é desligado. O servidor também pode ser parado manualmente usando o utilitário **"Services"**, o comando **"sc stop *`mysqld_service_name`*****, o comando **"NET STOP *`mysqld_service_name`***** ou o comando **"mysqladmin shutdown"**.

Você também tem a opção de instalar o servidor como um serviço manual, se não quiser que o serviço seja iniciado automaticamente durante o processo de inicialização. Para fazer isso, use a opção **`--install-manual`** em vez da opção **`--install`**:

```
C:\> "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysqld" --install-manual
```

##### Removendo o serviço

Para remover um servidor que foi instalado como serviço, primeiro pare-o se ele estiver em execução, executando **SC STOP *`mysqld_service_name`*** ou **NET STOP *`mysqld_service_name`***. Em seguida, use **SC DELETE *`mysqld_service_name`*** para removê-lo:

```
C:\> SC DELETE mysql
```

Alternativamente, use a opção **`--remove`** do **"mysqld"**.

```
C:\> "C:\Program Files\MySQL\MySQL Server 9.5\bin\mysqld" --remove
```

Se o **"mysqld"** não estiver em execução como serviço, você pode iniciá-lo a partir da linha de comando. Para instruções, consulte a Seção 2.3.3.6, “Iniciando Instâncias do MySQL como Serviços do Windows”.

Se você encontrar dificuldades durante a instalação, consulte a Seção 2.3.4, “Resolvendo Problemas em uma Instalação do Servidor MySQL do Windows”.

Para mais informações sobre como parar ou remover um serviço do Windows, consulte a Seção 7.8.2.2, “Iniciando Múltiplas Instâncias do MySQL como Serviços do Windows”.