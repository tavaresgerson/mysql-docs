### 6.3.1 mysqld  O Servidor MySQL

`mysqld`, também conhecido como MySQL Server, é um único programa multithread que faz a maior parte do trabalho em uma instalação do MySQL. Ele não gera processos adicionais. O MySQL Server gerencia o acesso ao diretório de dados do MySQL que contém bancos de dados e tabelas. O diretório de dados também é o local padrão para outras informações, como arquivos de log e arquivos de status.

::: info Note

Alguns pacotes de instalação contêm uma versão de depuração do servidor chamada **mysqld-debug**. Invoque esta versão em vez de `mysqld` para suporte de depuração, verificação de alocação de memória e suporte de arquivo de rastreamento (veja Seção 7.9.1.2, Criando arquivos de rastreamento).

:::

Quando o servidor MySQL é iniciado, ele escuta as conexões de rede de programas clientes e gerencia o acesso a bancos de dados em nome desses clientes.

O programa `mysqld` tem muitas opções que podem ser especificadas no início. Para uma lista completa de opções, execute este comando:

```
mysqld --verbose --help
```

O MySQL Server também tem um conjunto de variáveis de sistema que afetam sua operação enquanto ele é executado. Variaveis de sistema podem ser definidas na inicialização do servidor, e muitas delas podem ser alteradas no tempo de execução para efetuar a reconfiguração dinâmica do servidor. O MySQL Server também tem um conjunto de variáveis de status que fornecem informações sobre sua operação. Você pode monitorar essas variáveis de status para acessar as características de desempenho do tempo de execução.

Para uma descrição completa das opções de comando do MySQL Server, variáveis do sistema e variáveis de status, consulte a Seção 7.1, "O Servidor MySQL". Para informações sobre a instalação do MySQL e a configuração inicial, consulte o Capítulo 2, "Instalar o MySQL".
