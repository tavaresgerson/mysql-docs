### 4.3.1 mysqld — O Servidor MySQL

**mysqld**, também conhecido como MySQL Server, é um único programa multithreaded que executa a maior parte do trabalho em uma instalação MySQL. Ele não gera processos adicionais. O MySQL Server gerencia o acesso ao diretório de dados do MySQL que contém Databases e tables. O diretório de dados é também o local padrão para outras informações, como log files e status files.

Nota

Alguns pacotes de instalação contêm uma versão de debugging do server chamada **mysqld-debug**. Invoque esta versão em vez de **mysqld** para suporte a debugging, verificação de alocação de memória (memory allocation checking) e suporte a trace files (consulte a Seção 5.8.1.2, “Creating Trace Files”).

Quando o MySQL Server inicia, ele escuta por network connections de programas client e gerencia o acesso aos Databases em nome desses clients.

O programa **mysqld** possui muitas options que podem ser especificadas na inicialização (startup). Para uma lista completa de options, execute este comando:

```sql
mysqld --verbose --help
```

O MySQL Server também possui um conjunto de system variables que afetam sua operação enquanto está em execução. As System variables podem ser definidas na inicialização do server (server startup), e muitas delas podem ser alteradas em runtime para efetuar a reconfiguração dinâmica do server. O MySQL Server também possui um conjunto de status variables que fornecem informações sobre sua operação. Você pode monitorar estas status variables para acessar as características de performance (performance characteristics) em runtime.

Para uma descrição completa das options de comando, system variables e status variables do MySQL Server, consulte a Seção 5.1, “The MySQL Server”. Para obter informações sobre a instalação do MySQL e a configuração inicial, consulte o Capítulo 2, *Installing and Upgrading MySQL*.