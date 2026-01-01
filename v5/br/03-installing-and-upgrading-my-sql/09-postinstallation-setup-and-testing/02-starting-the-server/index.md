### 2.9.2 Começando o servidor

2.9.2.1 Solução de problemas para iniciar o servidor MySQL

Esta seção descreve como iniciar o servidor em sistemas Unix e Unix-like. (Para Windows, consulte a Seção 2.3.4.5, “Iniciando o Servidor pela Primeira Vez”.) Para obter algumas sugestões de comandos que você pode usar para testar se o servidor é acessível e funcionando corretamente, consulte a Seção 2.9.3, “Testando o Servidor”.

Inicie o servidor MySQL da seguinte forma, se sua instalação incluir **mysqld\_safe**:

```sql
$> bin/mysqld_safe --user=mysql &
```

Nota

Para sistemas Linux nos quais o MySQL é instalado usando pacotes RPM, o início e o desligamento do servidor são gerenciados usando o systemd, e não o **mysqld\_safe**, e o **mysqld\_safe** não é instalado. Veja a Seção 2.5.10, “Gerenciamento do servidor MySQL com o systemd”.

Inicie o servidor da seguinte forma se sua instalação incluir suporte ao systemd:

```sql
$> systemctl start mysqld
```

Substitua o nome do serviço apropriado, se ele for diferente de `mysqld` (por exemplo, `mysql` em sistemas SLES).

É importante que o servidor MySQL seja executado usando uma conta de login não privilegiada (não `root`). Para garantir isso, execute o **mysqld\_safe** como `root` e inclua a opção `--user`, conforme mostrado. Caso contrário, você deve executar o programa enquanto estiver logado como `mysql`, nesse caso, você pode omitir a opção `--user` do comando.

Para obter instruções adicionais sobre como executar o MySQL como um usuário não privilegiado, consulte a Seção 6.1.5, “Como executar o MySQL como um usuário normal”.

Se o comando falhar imediatamente e imprimir `mysqld ended`, procure informações no log de erro (que, por padrão, é o arquivo `host_name.err` no diretório de dados).

Se o servidor não conseguir acessar o diretório de dados, ele começará a acessar ou ler as tabelas de concessão no banco de dados `mysql`, e escreverá uma mensagem no log de erro. Tais problemas podem ocorrer se você negligenciar a criação das tabelas de concessão ao inicializar o diretório de dados antes de prosseguir com essa etapa, ou se você executar o comando que inicializa o diretório de dados sem a opção `--user`. Remova o diretório `data` e execute o comando com a opção `--user`.

Se você tiver outros problemas para iniciar o servidor, consulte a Seção 2.9.2.1, “Soluções de problemas para iniciar o servidor MySQL”. Para mais informações sobre o **mysqld\_safe**, consulte a Seção 4.3.2, “mysqld\_safe — Script de inicialização do servidor MySQL”. Para mais informações sobre o suporte ao systemd, consulte a Seção 2.5.10, “Gerenciamento do servidor MySQL com o systemd”.
