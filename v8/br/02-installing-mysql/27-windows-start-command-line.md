#### 2.3.3.6 Iniciar o MySQL a partir da Linha de Comando do Windows

O servidor MySQL pode ser iniciado manualmente a partir da linha de comando. Isso pode ser feito em qualquer versão do Windows.

Para iniciar o servidor `mysqld` a partir da linha de comando, você deve iniciar uma janela de console (ou DOS window) e digite este comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld"
```

O caminho para `mysqld` pode variar dependendo da localização de instalação do MySQL no seu sistema.

Você pode parar o servidor MySQL executando este comando:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqladmin" -u root shutdown
```

::: info Note

Se a conta de usuário MySQL `root` tiver uma senha, você precisa invocar `mysqladmin` com a opção `-p` e fornecer a senha quando solicitada.

:::

Este comando invoca o utilitário administrativo MySQL `mysqladmin` para se conectar ao servidor e dizer-lhe para desligar. O comando se conecta como o usuário MySQL `root`, que é a conta administrativa padrão no sistema de concessão MySQL.

::: info Note

Os usuários do sistema de concessão MySQL são totalmente independentes de qualquer usuário do sistema operacional sob o Microsoft Windows.

:::

Se `mysqld` não é iniciado, verifique o log de erro para ver se o servidor escreveu alguma mensagem lá para indicar a causa do problema. Por padrão, o log de erro está localizado no diretório `C:\Program Files\MySQL\MySQL Server 8.4\data`. É o arquivo com um sufixo de `.err`, ou pode ser especificado passando na opção `--log-error`. Alternativamente, você pode tentar iniciar o servidor com a opção `--console`; neste caso, o servidor pode exibir algumas informações úteis na tela para ajudar a resolver o problema.

A última opção é iniciar `mysqld` com as opções `--standalone` e `--debug`. Neste caso, `mysqld` escreve um arquivo de log `C:\mysqld.trace` que deve conter o motivo pelo qual `mysqld` não inicia. Veja Seção 7.9.4, The DBUG Package.

Use **mysqld --verbose --help** para exibir todas as opções que `mysqld` suporta.
