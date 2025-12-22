## 1.7 Conformidade com os padrões MySQL

Esta seção descreve como o MySQL se relaciona com os padrões ANSI / ISO SQL. O MySQL Server tem muitas extensões para o padrão SQL, e aqui você pode descobrir o que elas são e como usá-las. Você também pode encontrar informações sobre funcionalidades que faltam no MySQL Server e como contornar algumas das diferenças.

O padrão SQL vem evoluindo desde 1986 e existem várias versões. Neste manual, SQL-92 refere-se ao padrão lançado em 1992. SQL:1999, SQL:2003, SQL:2008 e SQL:2011 referem-se às versões do padrão lançadas nos anos correspondentes, sendo a última a versão mais recente. Usamos a frase o padrão SQL ou standard SQL para significar a versão atual do padrão SQL a qualquer momento.

Um dos nossos principais objetivos com o produto é continuar a trabalhar em direção à conformidade com o padrão SQL, mas sem sacrificar a velocidade ou confiabilidade. Não temos medo de adicionar extensões ao SQL ou suporte a recursos não-SQL se isso aumentar muito a usabilidade do MySQL Server para um grande segmento de nossa base de usuários. A interface `HANDLER` é um exemplo dessa estratégia.

Continuamos a apoiar bancos de dados transacionais e não transacionais para satisfazer tanto o uso 24/7 de missão crítica quanto o uso pesado da Web ou de registro.

O MySQL Server foi originalmente projetado para trabalhar com bancos de dados de tamanho médio (10-100 milhões de linhas, ou cerca de 100MB por tabela) em pequenos sistemas de computador.

Não estamos visando suporte em tempo real, embora as capacidades de replicação do MySQL ofereçam funcionalidade significativa.

O MySQL suporta os níveis ODBC 0 a 3.51.

O MySQL suporta o agrupamento de banco de dados de alta disponibilidade usando o motor de armazenamento `NDBCLUSTER`. Veja o Capítulo 25, *MySQL NDB Cluster 8.4*.

Implementamos a funcionalidade XML que suporta a maior parte do padrão XPath do W3C. Veja Seção 14.11, Funções XML.

O MySQL suporta um tipo de dados nativo JSON, conforme definido pelo RFC 7159, e baseado no padrão ECMAScript (ECMA-262).

### Seleção de modos SQL

O servidor MySQL pode operar em diferentes modos SQL, e pode aplicar esses modos de forma diferente para diferentes clientes, dependendo do valor da variável do sistema `sql_mode`. Os DBAs podem definir o modo SQL global para corresponder aos requisitos operacionais do servidor do site, e cada aplicativo pode definir seu modo SQL de sessão para seus próprios requisitos.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele executa. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

Para obter mais informações sobre a configuração do modo SQL, ver a Secção 7.1.11, "Server SQL Modes".

### Executar o MySQL no modo ANSI

Para executar o MySQL Server no modo ANSI, inicie `mysqld` com a opção `--ansi`.

```
--transaction-isolation=SERIALIZABLE --sql-mode=ANSI
```

Para obter o mesmo efeito em tempo de execução, execute estas duas instruções:

```
SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET GLOBAL sql_mode = 'ANSI';
```

Você pode ver que definir a variável de sistema `sql_mode` para `'ANSI'` permite todas as opções de modo SQL que são relevantes para o modo ANSI da seguinte forma:

```
mysql> SET GLOBAL sql_mode='ANSI';
mysql> SELECT @@GLOBAL.sql_mode;
        -> 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ANSI'
```

Executar o servidor no modo ANSI com `--ansi` não é exatamente o mesmo que definir o modo SQL para `'ANSI'` porque a opção `--ansi` também define o nível de isolamento da transação.

Ver secção 7.1.7, "Opções de comando do servidor".
