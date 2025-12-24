## 3.7 Atualização de instalações binárias ou baseadas em pacotes do MySQL em Unix/Linux

Esta seção descreve como atualizar instalações binárias e baseadas em pacotes do MySQL em Unix/Linux.

- Melhoria no local
- Atualização lógica
- Atualização do cluster do MySQL

### Melhoria no local

Uma atualização no local envolve desligar o antigo servidor MySQL, substituir os antigos binários ou pacotes MySQL pelos novos, reiniciar o MySQL no diretório de dados existente e atualizar quaisquer partes restantes da instalação existente que necessitem de atualização.

::: info Note

Se você estiver atualizando uma instalação originalmente produzida pela instalação de vários pacotes RPM, atualize todos os pacotes, não apenas alguns. Por exemplo, se você instalou anteriormente os RPMs do servidor e do cliente, não atualize apenas o RPM do servidor.

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui o suporte do systemd para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, o `mysqld_safe` não está instalado. Nesses casos, use o systemd para inicialização e desligamento do servidor em vez dos métodos usados nas seguintes instruções.

Para atualizações de instalações de cluster MySQL, consulte também Upgrade de Cluster MySQL.

:::

Para efectuar uma actualização no local:

1. Revise as informações na Secção 3. 1, " Antes de Começar " .
2. Assegure-se de que a sua instalação está pronta para a actualização, completando as verificações preliminares da secção 3.6, "Preparação da sua instalação para a actualização".
3. Se você usar transações XA com `InnoDB`, execute `XA RECOVER` antes da atualização para verificar se há transações XA não comprometidas. Se os resultados forem retornados, comete ou reverta as transações XA emitindo uma instrução `XA COMMIT` ou `XA ROLLBACK`.
4. Se você normalmente executar seu servidor MySQL configurado com `innodb_fast_shutdown` definido para `2` (desligamento frio), configure-o para executar um desligamento rápido ou lento executando uma dessas instruções:

   ```
   SET GLOBAL innodb_fast_shutdown = 1; -- fast shutdown
   SET GLOBAL innodb_fast_shutdown = 0; -- slow shutdown
   ```

   Com um desligamento rápido ou lento, `InnoDB` deixa seus registros de desativação e arquivos de dados em um estado que pode ser tratado em caso de diferenças de formato de arquivo entre versões.
5. Desligar o servidor MySQL antigo. Por exemplo:

   ```
   mysqladmin -u root -p shutdown
   ```
6. Atualize os binários ou pacotes do MySQL. Se atualizar uma instalação binária, desempaquete o novo pacote de distribuição binária do MySQL. Veja Obter e Desempaquetar a Distribuição. Para instalações baseadas em pacotes, instale os novos pacotes.
7. Inicie o servidor MySQL 8.4, usando o diretório de dados existente. Por exemplo:

   ```
   mysqld_safe --user=mysql --datadir=/path/to/existing-datadir &
   ```

   Se houver tablespaces `InnoDB` criptografados, use a opção `--early-plugin-load` para carregar o plugin de chaveiro.

   Quando você inicia o servidor MySQL 8.4, ele detecta automaticamente se as tabelas do dicionário de dados estão presentes. Se não, o servidor cria-as no diretório de dados, preenche-as com metadados e, em seguida, prossegue com sua sequência de inicialização normal. Durante este processo, o servidor atualiza os metadados para todos os objetos de banco de dados, incluindo bancos de dados, espaços de tabelas, tabelas do sistema e do usuário, visualizações e programas armazenados (procedimentos e funções armazenados, gatilhos e eventos do agendador de eventos). O servidor também remove arquivos que anteriormente eram usados para armazenamento de metadados. Por exemplo, após a atualização do MySQL 8.3 para o MySQL 8.4, você pode notar que as tabelas não têm mais arquivos `.frm` .

   Se esta etapa falhar, o servidor reverterá todas as alterações no diretório de dados. Neste caso, você deve remover todos os arquivos de registro de refazer, iniciar o servidor MySQL 8.3 no mesmo diretório de dados e corrigir a causa de quaisquer erros. Em seguida, execute outro desligamento lento do servidor 8.3 e inicie o servidor MySQL 8.4 para tentar novamente.
8. Na etapa anterior, o servidor atualiza o dicionário de dados conforme necessário, fazendo quaisquer alterações necessárias no banco de dados do sistema `mysql` entre o MySQL 8.3 e o MySQL 8.4, para que você possa tirar proveito de novos privilégios ou recursos. Ele também atualiza o Performance Schema, `INFORMATION_SCHEMA`, e `sys` para o MySQL 8.4, e examina todos os bancos de dados de usuários para incompatibilidades com a versão atual do MySQL.

::: info Note

O processo de atualização não atualiza o conteúdo das tabelas de fuso horário.

:::

### Atualização lógica

Uma atualização lógica envolve a exportação do SQL da antiga instância do MySQL usando um utilitário de backup ou exportação, como `mysqldump`, instalar o novo servidor MySQL e aplicar o SQL à sua nova instância do MySQL. Para detalhes sobre o que pode precisar de atualização, consulte a Seção 3.4, "O que o processo de atualização do MySQL atualiza".

::: info Note

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui o suporte do systemd para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, o `mysqld_safe` não está instalado. Nesses casos, use o systemd para inicialização e desligamento do servidor em vez dos métodos usados nas seguintes instruções.

:::

Aviso

A aplicação de SQL extraído de uma versão anterior do MySQL a uma nova versão do MySQL pode resultar em erros devido a incompatibilidades introduzidas por recursos e recursos novos, alterados, depreciados ou removidos. Consequentemente, o SQL extraído de uma versão anterior do MySQL pode exigir modificação para permitir uma atualização lógica.

Para identificar incompatibilidades antes de atualizar para a versão mais recente do MySQL 8.4, execute os passos descritos na Seção 3.6, "Preparando sua instalação para atualização".

Para realizar uma atualização lógica:

1. Revise as informações na Secção 3. 1, " Antes de Começar " .

2. Exportar os dados existentes da instalação anterior do MySQL:

   ```
   mysqldump -u root -p
     --add-drop-table --routines --events
     --all-databases --force > data-for-upgrade.sql
   ```

   ::: info Note

   Use as opções `--routines` e `--events` com `mysqldump` (como mostrado acima) se seus bancos de dados incluírem programas armazenados. A opção `--all-databases` inclui todos os bancos de dados no depósito, incluindo o banco de dados `mysql` que contém as tabelas do sistema.

   :::

   Importância

   Se você tem tabelas que contêm colunas geradas, use o utilitário `mysqldump` fornecido com o MySQL 5.7.9 ou superior para criar seus arquivos de despejo. O utilitário `mysqldump` fornecido em versões anteriores usa sintaxe incorreta para definições de colunas geradas (Bug `#20769542`). Você pode usar a tabela do Esquema de Informações `COLUMNS` para identificar tabelas com colunas geradas.

3. Desligar o servidor MySQL antigo. Por exemplo:

   ```
   mysqladmin -u root -p shutdown
   ```

4. Para instruções de instalação, ver Capítulo 2, *Instalar MySQL*.

5. Iniciar um novo diretório de dados, conforme descrito na Secção 2.9.1, "Initialização do diretório de dados".

   ```
   mysqld --initialize --datadir=/path/to/8.4-datadir
   ```

   Copie a senha temporária `'root'@'localhost'` exibida em sua tela ou escrita em seu registro de erros para uso posterior.

6. Inicie o servidor MySQL 8.4, usando o novo diretório de dados. Por exemplo:

   ```
   mysqld_safe --user=mysql --datadir=/path/to/8.4-datadir &
   ```

7. Reiniciar a senha de `root`:

   ```
   $> mysql -u root -p
   Enter password: ****  <- enter temporary root password
   ```

   ```
   mysql> ALTER USER USER() IDENTIFIED BY 'your new password';
   ```

8. Carregar o arquivo de despejo criado anteriormente no novo servidor MySQL. Por exemplo:

   ```
   mysql -u root -p --force < data-for-upgrade.sql
   ```

   ::: info Note

   Não é recomendado carregar um arquivo de despejo quando os GTIDs estão habilitados no servidor (`gtid_mode=ON`), se o seu arquivo de despejo inclui tabelas de sistema. O `mysqldump` emite instruções DML para as tabelas de sistema que usam o motor de armazenamento MyISAM não transacional, e essa combinação não é permitida quando os GTIDs estão habilitados.

   :::

9. Executar quaisquer operações de atualização restantes:

   Desligue o servidor e reinicie-o com a opção `--upgrade=FORCE` para executar as tarefas de atualização restantes:

   ```
   mysqladmin -u root -p shutdown
   mysqld_safe --user=mysql --datadir=/path/to/8.4-datadir --upgrade=FORCE &
   ```

   Ao reiniciar com PH CODE 0, o servidor faz todas as alterações necessárias no esquema do sistema PH CODE 1 entre o MySQL 8.3 e o MySQL 8.4, para que você possa tirar proveito de novos privilégios ou recursos. Ele também atualiza o esquema de desempenho, PH CODE 2 e o esquema PH CODE 3 para o MySQL 8.4, e examina todos os esquemas de usuário por incompatibilidades com a versão atual do MySQL.

::: info Note

O processo de atualização não atualiza o conteúdo das tabelas de fuso horário.

:::

### Atualização do cluster do MySQL

As informações nesta seção são um complemento do procedimento de atualização no local descrito em In-Place Upgrade, para uso se você estiver atualizando o MySQL Cluster.

Uma atualização do cluster MySQL pode ser realizada como uma atualização rotativa regular, seguindo as três etapas habituais:

1. Atualizar os nós da MGM.
2. Atualize os nós de dados um de cada vez.
3. Atualizar os nós da API um de cada vez (incluindo servidores MySQL).

Existem duas etapas para atualizar cada `mysqld`:

1. Importar o dicionário de dados.

   Inicie o novo servidor com a opção `--upgrade=MINIMAL` para atualizar o dicionário de dados, mas não as tabelas do sistema.

   O servidor MySQL deve estar conectado ao `NDB` para que esta fase seja concluída. Se qualquer `NDB` ou `NDBINFO` tabelas existem, e o servidor não pode se conectar ao cluster, ele sai com uma mensagem de erro:

   ```
   Failed to Populate DD tables.
   ```
2. Atualize as tabelas do sistema reiniciando cada `mysqld` individual sem a `--upgrade=MINIMAL` opção.
