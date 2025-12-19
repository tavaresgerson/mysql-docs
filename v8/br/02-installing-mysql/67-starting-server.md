### 2.9.2 Início do Servidor

Esta seção descreve como iniciar o servidor em sistemas Unix e Unix-like. (Para Windows, veja Seção 2.3.3.5, "Início do servidor pela primeira vez") Para alguns comandos sugeridos que você pode usar para testar se o servidor é acessível e funciona corretamente, veja Seção 2.9.3, "Teste do servidor".

Inicie o servidor MySQL assim se a sua instalação inclui **mysqld\_safe**:

```
$> bin/mysqld_safe --user=mysql &
```

::: info Note

Para sistemas Linux nos quais o MySQL é instalado usando pacotes RPM, a inicialização e o desligamento do servidor são gerenciados usando systemd em vez de **mysqld\_safe**, e **mysqld\_safe** não é instalado.

:::

Inicie o servidor assim se a sua instalação incluir suporte para systemd:

```
$> systemctl start mysqld
```

Substitua o nome de serviço apropriado se for diferente de `mysqld` (por exemplo, `mysql` em sistemas SLES).

É importante que o servidor MySQL seja executado usando uma conta de login não privilegiada (não `root`). Para garantir isso, execute **mysqld\_safe** como `root` e inclua a opção `--user` como mostrado. Caso contrário, você deve executar o programa enquanto estiver logado como `mysql`, caso em que você pode omitir a opção `--user` do comando.

Para instruções adicionais sobre como executar o MySQL como um usuário não privilegiado, consulte a Seção 8.1.5, "Como executar o MySQL como um usuário normal".

Se o comando falhar imediatamente e imprimir `mysqld ended`, procure informações no registro de erros (que por padrão é o arquivo `host_name.err` no diretório de dados).

Se o servidor não puder acessar o diretório de dados que inicia ou ler as tabelas de concessão no esquema `mysql`, ele escreve uma mensagem em seu registro de erros. Tais problemas podem ocorrer se você negligenciou a criação das tabelas de concessão iniciando o diretório de dados antes de prosseguir com esta etapa, ou se você executou o comando que inicializa o diretório de dados sem a opção `--user`. Remova o diretório `data` e execute o comando com a opção `--user`.

Se você tiver outros problemas ao iniciar o servidor, consulte a Seção 2.9.2.1, "Solução de Problemas ao iniciar o MySQL Server". Para mais informações sobre **mysqld\_safe**, consulte a Seção 6.3.2, "mysqld\_safe" "MySQL Server Startup Script". Para mais informações sobre o suporte do systemd, consulte a Seção 2.5.9, "Gerenciamento do MySQL Server com o systemd".
