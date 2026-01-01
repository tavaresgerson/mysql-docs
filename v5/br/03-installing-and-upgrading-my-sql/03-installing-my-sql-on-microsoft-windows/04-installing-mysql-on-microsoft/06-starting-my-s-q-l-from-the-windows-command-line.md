#### 2.3.4.6 Começando o MySQL a partir da linha de comando do Windows

O servidor MySQL pode ser iniciado manualmente a partir da linha de comando. Isso pode ser feito em qualquer versão do Windows.

Para iniciar o servidor **mysqld** a partir da linha de comando, você deve abrir uma janela de console (ou janela DOS) e digitar o seguinte comando:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld"
```

O caminho para o **mysqld** pode variar dependendo da localização de instalação do MySQL no seu sistema.

Você pode parar o servidor MySQL executando este comando:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqladmin" -u root shutdown
```

Nota

Se a conta de usuário `root` do MySQL tiver uma senha, você precisa invocar o **mysqladmin** com a opção `-p` e fornecer a senha quando solicitado.

Este comando invoca o utilitário administrativo MySQL **mysqladmin** para se conectar ao servidor e informá-lo a desligar. O comando se conecta como o usuário `root` do MySQL, que é a conta administrativa padrão no sistema de concessão do MySQL.

Nota

Os usuários no sistema de concessão MySQL são totalmente independentes de quaisquer usuários do sistema operacional do Microsoft Windows.

Se o **mysqld** não iniciar, verifique o log de erro para ver se o servidor escreveu alguma mensagem lá para indicar a causa do problema. Por padrão, o log de erro está localizado no diretório `C:\Program Files\MySQL\MySQL Server 5.7\data`. É o arquivo com o sufixo `.err`, ou pode ser especificado passando a opção `--log-error`. Alternativamente, você pode tentar iniciar o servidor com a opção `--console`; nesse caso, o servidor pode exibir algumas informações úteis na tela para ajudar a resolver o problema.

A última opção é iniciar o **mysqld** com as opções `--standalone` e `--debug`. Nesse caso, o **mysqld** escreve um arquivo de log `C:\mysqld.trace` que deve conter a razão pela qual o **mysqld** não inicia. Veja a Seção 5.8.3, “O Pacote DBUG”.

Use **mysqld --verbose --help** para exibir todas as opções que o **mysqld** suporta.
