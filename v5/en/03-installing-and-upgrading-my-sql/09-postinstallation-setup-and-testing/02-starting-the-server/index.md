### 2.9.2 Iniciando o Server

2.9.2.1 Solução de Problemas na Inicialização do MySQL Server

Esta seção descreve como iniciar o server em sistemas Unix e similares a Unix. (Para Windows, veja Seção 2.3.4.5, “Iniciando o Server pela Primeira Vez”.) Para alguns comandos sugeridos que você pode usar para testar se o server está acessível e funcionando corretamente, veja Seção 2.9.3, “Testando o Server”.

Inicie o MySQL server desta forma se sua instalação incluir **mysqld_safe**:

```sql
$> bin/mysqld_safe --user=mysql &
```

Nota

Para sistemas Linux nos quais o MySQL é instalado usando pacotes RPM, a inicialização e o desligamento do server são gerenciados usando systemd em vez de **mysqld_safe**, e o **mysqld_safe** não é instalado. Veja Seção 2.5.10, “Gerenciando o MySQL Server com systemd”.

Inicie o server desta forma se sua instalação incluir suporte a systemd:

```sql
$> systemctl start mysqld
```

Substitua o nome do service apropriado se ele for diferente de `mysqld` (por exemplo, `mysql` em sistemas SLES).

É importante que o MySQL server seja executado usando uma conta de login sem privilégios (não-`root`). Para garantir isso, execute o **mysqld_safe** como `root` e inclua a opção `--user`, conforme mostrado. Caso contrário, você deve executar o programa enquanto estiver logado como `mysql`, nesse caso você pode omitir a opção `--user` do comando.

Para instruções adicionais sobre como executar o MySQL como um usuário sem privilégios, veja Seção 6.1.5, “Como Executar o MySQL como um Usuário Normal”.

Se o comando falhar imediatamente e imprimir `mysqld ended`, procure por informações no error log (que por padrão é o arquivo `host_name.err` no data directory).

Se o server não conseguir acessar o data directory de inicialização ou ler as grant tables no `mysql` database, ele escreverá uma mensagem em seu error log. Tais problemas podem ocorrer se você negligenciou a criação das grant tables inicializando o data directory antes de prosseguir para esta etapa, ou se você executou o comando que inicializa o data directory sem a opção `--user`. Remova o `data` directory e execute o comando com a opção `--user`.

Se você tiver outros problemas ao iniciar o server, veja Seção 2.9.2.1, “Solução de Problemas na Inicialização do MySQL Server”. Para mais informações sobre **mysqld_safe**, veja Seção 4.3.2, “mysqld_safe — Script de Inicialização do MySQL Server”. Para mais informações sobre suporte a systemd, veja Seção 2.5.10, “Gerenciando o MySQL Server com systemd”.