### 4.3.1 mysqld — O Servidor MySQL

**mysqld**, também conhecido como MySQL Server, é um único programa multithread que realiza a maior parte do trabalho em uma instalação do MySQL. Ele não gera processos adicionais. O MySQL Server gerencia o acesso ao diretório de dados do MySQL, que contém bancos de dados e tabelas. O diretório de dados também é o local padrão para outras informações, como arquivos de log e arquivos de status.

Nota

Alguns pacotes de instalação contêm uma versão de depuração do servidor chamada **mysqld-debug**. Inicie essa versão em vez de **mysqld** para obter suporte de depuração, verificação de alocação de memória e suporte a arquivos de registro (consulte a Seção 5.8.1.2, “Criando arquivos de registro”).

Quando o servidor MySQL é iniciado, ele escuta as conexões de rede dos programas cliente e gerencia o acesso aos bancos de dados em nome desses clientes.

O programa **mysqld** tem muitas opções que podem ser especificadas durante o início. Para obter uma lista completa das opções, execute este comando:

```sh
mysqld --verbose --help
```

O MySQL Server também possui um conjunto de variáveis de sistema que afetam seu funcionamento durante a execução. As variáveis de sistema podem ser definidas durante a inicialização do servidor e muitas delas podem ser alteradas durante a execução para efetuar a reconfiguração dinâmica do servidor. O MySQL Server também possui um conjunto de variáveis de status que fornecem informações sobre seu funcionamento. Você pode monitorar essas variáveis de status para acessar as características de desempenho em tempo de execução.

Para uma descrição completa das opções de comando do MySQL Server, das variáveis de sistema e das variáveis de status, consulte a Seção 5.1, “O MySQL Server”. Para informações sobre a instalação do MySQL e a configuração inicial, consulte o Capítulo 2, *Instalando e Atualizando o MySQL*.
