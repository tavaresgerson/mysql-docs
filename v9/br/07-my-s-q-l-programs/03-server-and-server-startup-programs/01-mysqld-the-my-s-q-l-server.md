### 6.3.1 mysqld — O Servidor MySQL

**mysqld**, também conhecido como Servidor MySQL, é um único programa multithread que realiza a maior parte do trabalho em uma instalação do MySQL. Ele não gera processos adicionais. O Servidor MySQL gerencia o acesso ao diretório de dados MySQL, que contém bancos de dados e tabelas. O diretório de dados também é o local padrão para outras informações, como arquivos de log e arquivos de status.

Nota

Alguns pacotes de instalação contêm uma versão de depuração do servidor chamada **mysqld-debug**. Inicie essa versão em vez de **mysqld** para suporte de depuração, verificação de alocação de memória e suporte a arquivos de registro (consulte a Seção 7.9.1.2, “Criando Arquivos de Registro”).

Quando o servidor MySQL é iniciado, ele escuta conexões de rede de programas cliente e gerencia o acesso aos bancos de dados em nome desses clientes.

O programa **mysqld** tem muitas opções que podem ser especificadas na inicialização. Para obter uma lista completa das opções, execute este comando:

```
mysqld --verbose --help
```

O Servidor MySQL também tem um conjunto de variáveis de sistema que afetam sua operação enquanto está em execução. As variáveis de sistema podem ser definidas na inicialização do servidor e muitas delas podem ser alteradas em tempo de execução para efetuar a reconfiguração dinâmica do servidor. O Servidor MySQL também tem um conjunto de variáveis de status que fornecem informações sobre sua operação. Você pode monitorar essas variáveis de status para acessar as características de desempenho em tempo de execução.

Para uma descrição completa das opções de comando, variáveis de sistema e variáveis de status do Servidor MySQL, consulte a Seção 7.1, “O Servidor MySQL”. Para informações sobre a instalação do MySQL e a configuração inicial, consulte o Capítulo 2, *Instalando o MySQL*.