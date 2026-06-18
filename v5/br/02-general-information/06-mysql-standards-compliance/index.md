## 1.6 Conformidade com os Padrões MySQL

Esta seção descreve como o MySQL se relaciona com os padrões ANSI/ISO SQL. O MySQL Server tem muitas extensões ao padrão SQL, e aqui você pode descobrir quais são elas e como usá-las. Você também pode encontrar informações sobre funcionalidades ausentes no MySQL Server e como contornar algumas das diferenças.

O padrão SQL tem evoluído desde 1986 e existem várias versões. Neste manual, “SQL-92” refere-se ao padrão lançado em 1992. “SQL:1999”, “SQL:2003”, “SQL:2008” e “SQL:2011” referem-se às versões do padrão lançadas nos anos correspondentes, sendo a última a versão mais recente. Usamos a frase “o padrão SQL” ou “SQL padrão” para nos referirmos à versão atual do Padrão SQL em qualquer momento.

Um dos nossos principais objetivos com o produto é continuar trabalhando para a conformidade com o padrão SQL, mas sem comprometer a velocidade ou a confiabilidade. Não temos medo de adicionar extensões ao SQL ou suporte para recursos não SQL, se isso aumentar significativamente a usabilidade do MySQL Server para um grande segmento de nossa base de usuários. A interface `HANDLER` é um exemplo dessa estratégia. Veja a Seção 13.2.4, “Instrução HANDLER”.

Continuamos a suportar bancos de dados transacionais e não transacionais para atender tanto ao uso 24/7 crítico para a missão quanto ao uso pesado da Web ou de registro.

O MySQL Server foi originalmente projetado para funcionar com bancos de dados de tamanho médio (10 a 100 milhões de linhas, ou cerca de 100 MB por tabela) em sistemas de computadores pequenos. Hoje, o MySQL Server lida com bancos de dados do tamanho de terabytes, mas o código também pode ser compilado em uma versão reduzida adequada para dispositivos portáteis e embutidos. O design compacto do servidor MySQL permite o desenvolvimento em ambas as direções sem conflitos na árvore de código-fonte.

Não estamos direcionando suporte em tempo real, embora as capacidades de replicação do MySQL ofereçam funcionalidades significativas.

O MySQL suporta os níveis ODBC de 0 a 3,51.

O MySQL suporta o agrupamento de bancos de dados de alta disponibilidade usando o mecanismo de armazenamento `NDBCLUSTER`. Consulte o Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*.

Implementamos a funcionalidade XML que suporta a maioria do padrão W3C XPath. Veja a Seção 12.11, “Funções XML”.

O MySQL (5.7.8 e versões posteriores) suporta um tipo de dados JSON nativo conforme definido pelo RFC 7159 e baseado no padrão ECMAScript (ECMA-262). Veja a Seção 11.5, “O Tipo de Dados JSON”. O MySQL também implementa um subconjunto das funções SQL/JSON especificadas por um rascunho pré-publicação do padrão SQL:2016; consulte a Seção 12.17, “Funções JSON”, para mais informações.

### Selecionando modos SQL

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. Os administradores de banco de dados podem definir o modo SQL global para atender às necessidades do servidor do site, e cada aplicativo pode definir seu próprio modo SQL de sessão de acordo com suas necessidades.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

Para obter mais informações sobre a configuração do modo SQL, consulte a Seção 5.1.10, “Modos SQL do servidor”.

### Executando o MySQL no modo ANSI

Para executar o MySQL Server no modo ANSI, inicie o **mysqld** com a opção `--ansi`. Executar o servidor no modo ANSI é o mesmo que iniciá-lo com as seguintes opções:

```sql
--transaction-isolation=SERIALIZABLE --sql-mode=ANSI
```

Para obter o mesmo efeito em tempo de execução, execute essas duas instruções:

```sql
SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET GLOBAL sql_mode = 'ANSI';
```

Você pode ver que definir a variável de sistema `sql_mode` para `'ANSI'` habilita todas as opções de modo SQL relevantes para o modo ANSI da seguinte forma:

```sql
mysql> SET GLOBAL sql_mode='ANSI';
mysql> SELECT @@GLOBAL.sql_mode;
        -> 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ANSI'
```

Executar o servidor no modo ANSI com `--ansi` não é exatamente o mesmo que definir o modo SQL para `'ANSI'`, pois a opção `--ansi` também define o nível de isolamento de transação.

Consulte a Seção 5.1.6, “Opções de comando do servidor”.
