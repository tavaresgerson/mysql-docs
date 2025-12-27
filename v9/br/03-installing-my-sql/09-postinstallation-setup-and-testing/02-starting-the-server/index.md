### 2.9.2 Iniciar o Servidor

2.9.2.1 Solucionando Problemas para Iniciar o Servidor MySQL

Esta seção descreve como iniciar o servidor no Unix e sistemas semelhantes ao Unix. (Para Windows, consulte a Seção 2.3.3.5, “Iniciando o Servidor pela Primeira Vez”.) Para algumas instruções de comandos que você pode usar para testar se o servidor é acessível e funcionando corretamente, consulte a Seção 2.9.3, “Testando o Servidor”.

Inicie o servidor MySQL da seguinte forma se sua instalação incluir **mysqld\_safe**:

```
$> bin/mysqld_safe --user=mysql &
```

Observação

Para sistemas Linux nos quais o MySQL é instalado usando pacotes RPM, o início e o desligamento do servidor são gerenciados usando o systemd em vez de **mysqld\_safe**, e **mysqld\_safe** não é instalado. Consulte a Seção 2.5.9, “Gerenciando o Servidor MySQL com o systemd”.

Inicie o servidor da seguinte forma se sua instalação incluir suporte ao systemd:

```
$> systemctl start mysqld
```

Substitua o nome do serviço apropriado se ele for diferente de `mysqld` (por exemplo, `mysql` em sistemas SLES).

É importante que o servidor MySQL seja executado usando uma conta de login não privilegiada (não `root`). Para garantir isso, execute **mysqld\_safe** como `root` e inclua a opção `--user`, conforme mostrado. Caso contrário, você deve executar o programa enquanto estiver logado como `mysql`, no qual caso você pode omitir a opção `--user` do comando.

Para obter mais instruções para executar o MySQL como um usuário não privilegiado, consulte a Seção 8.1.5, “Como Executar o MySQL como um Usuário Normal”.

Se o comando falhar imediatamente e imprimir `mysqld ended`, procure informações no log de erro (que, por padrão, é o arquivo `host_name.err` no diretório de dados).

Se o servidor não conseguir acessar o diretório de dados, ele começa a acessar ou ler as tabelas de concessão no esquema `mysql`, escrevendo uma mensagem no log de erro. Esse tipo de problema pode ocorrer se você negligenciar a criação das tabelas de concessão ao inicializar o diretório de dados antes de prosseguir com essa etapa, ou se você executar o comando que inicializa o diretório de dados sem a opção `--user`. Remova o diretório `data` e execute o comando com a opção `--user`.

Se você tiver outros problemas ao iniciar o servidor, consulte a Seção 2.9.2.1, “Soluções de problemas para iniciar o servidor MySQL”. Para mais informações sobre o **mysqld\_safe**, consulte a Seção 6.3.2, “mysqld\_safe — Script de inicialização do servidor MySQL”. Para mais informações sobre o suporte do systemd, consulte a Seção 2.5.9, “Gerenciamento do servidor MySQL com o systemd”.