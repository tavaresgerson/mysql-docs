### 2.9.2 Iniciando o Servidor

Esta seção descreve como iniciar o servidor em sistemas Unix e semelhantes ao Unix. (Para Windows, consulte a Seção 2.3.3.5, “Iniciando o Servidor pela Primeira Vez”.) Para algumas sugestões de comandos que você pode usar para testar se o servidor é acessível e funcionando corretamente, consulte a Seção 2.9.3, “Testando o Servidor”.

Inicie o servidor MySQL da seguinte forma se sua instalação incluir `mysqld_safe`:

```
$> bin/mysqld_safe --user=mysql &
```

::: info Nota

Para sistemas Linux em que o MySQL é instalado usando pacotes RPM, o início e o desligamento do servidor são gerenciados usando systemd em vez de `mysqld_safe`, e `mysqld_safe` não é instalado. Consulte a Seção 2.5.9, “Gerenciando o Servidor MySQL com systemd”.

Inicie o servidor da seguinte forma se sua instalação incluir suporte ao systemd:

```
$> systemctl start mysqld
```

Substitua o nome do serviço apropriado se ele for diferente de `mysqld` (por exemplo, `mysql` em sistemas SLES).

É importante que o servidor MySQL seja executado usando uma conta de login não privilegiada (não `root`). Para garantir isso, execute `mysqld_safe` como `root` e inclua a opção `--user` conforme mostrado. Caso contrário, você deve executar o programa enquanto estiver logado como `mysql`, no qual caso você pode omitir a opção `--user` do comando.

Para obter mais instruções sobre como executar o MySQL como um usuário não privilegiado, consulte a Seção 8.1.5, “Como Executar o MySQL como um Usuário Normal”.

Se o comando falhar imediatamente e imprimir `mysqld ended`, procure informações no log de erro (que, por padrão, é o arquivo `host_name.err` no diretório de dados).

Se o servidor não conseguir acessar o diretório de dados que ele começa ou ler as tabelas de concessão no esquema `mysql`, ele escreve uma mensagem em seu log de erro. Tais problemas podem ocorrer se você negligenciar criar as tabelas de concessão ao inicializar o diretório de dados antes de prosseguir com essa etapa, ou se você executar o comando que inicializa o diretório de dados sem a opção `--user`. Remova o diretório `data` e execute o comando com a opção `--user`.