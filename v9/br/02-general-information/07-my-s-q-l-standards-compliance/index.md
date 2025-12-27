## 1.7 Conformidade com Padrões de MySQL

1.7.1 Extensões do MySQL para o SQL Padrão

1.7.2 Diferenças do MySQL em relação ao SQL Padrão

1.7.3 Como o MySQL Lidar com Restrições

Esta seção descreve como o MySQL se relaciona com os padrões de SQL ANSI/ISO. O MySQL Server tem muitas extensões ao padrão SQL, e aqui você pode descobrir quais são elas e como usá-las. Você também pode encontrar informações sobre funcionalidades ausentes no MySQL Server e como contornar algumas das diferenças.

O padrão SQL tem evoluído desde 1986 e existem várias versões. Neste manual, “SQL-92” refere-se ao padrão lançado em 1992. “SQL:1999”, “SQL:2003”, “SQL:2008” e “SQL:2011” referem-se às versões do padrão lançadas nos anos correspondentes, sendo a última a versão mais recente. Usamos a frase “o padrão SQL” ou “SQL Padrão” para significar a versão atual do Padrão SQL em qualquer momento.

Um de nossos principais objetivos com o produto é continuar trabalhando para a conformidade com o padrão SQL, mas sem sacrificar velocidade ou confiabilidade. Não temos medo de adicionar extensões ao SQL ou suporte para recursos não SQL, se isso aumentar significativamente a usabilidade do MySQL Server para um grande segmento de nossa base de usuários. A interface `HANDLER` é um exemplo dessa estratégia. Veja a Seção 15.2.5, “Instrução HANDLER”.

Continuamos a suportar bancos de dados transacionais e não transacionais para atender tanto ao uso mission-critical 24/7 quanto ao uso pesado na Web ou registro.

O MySQL Server foi originalmente projetado para trabalhar com bancos de dados de tamanho médio (10 a 100 milhões de linhas, ou cerca de 100 MB por tabela) em sistemas de computadores pequenos. Hoje, o MySQL Server lida com bancos de dados do tamanho de terabytes.

Não estamos direcionando suporte em tempo real, embora as capacidades de replicação do MySQL ofereçam funcionalidades significativas.

O MySQL suporta os níveis ODBC de 0 a 3.51.

O MySQL suporta o agrupamento de bancos de dados de alta disponibilidade usando o mecanismo de armazenamento `NDBCLUSTER`. Veja o Capítulo 25, *MySQL NDB Cluster 9.5*.

Implementamos a funcionalidade XML que suporta a maioria do padrão W3C XPath. Veja a Seção 14.11, “Funções XML”.

O MySQL suporta um tipo de dados nativo JSON conforme definido pelo RFC 7159 e baseado no padrão ECMAScript (ECMA-262). Veja a Seção 13.5, “O Tipo de Dados JSON”. O MySQL também implementa um subconjunto das funções SQL/JSON especificadas por um rascunho de pré-publicação do padrão SQL:2016; veja a Seção 14.17, “Funções JSON”, para mais informações.

### Selecionando Modos SQL

O servidor MySQL pode operar em diferentes modos SQL e pode aplicar esses modos de maneira diferente para diferentes clientes, dependendo do valor da variável de sistema `sql_mode`. Os DBA podem definir o modo SQL global para atender aos requisitos de operação do servidor do site, e cada aplicativo pode definir seu modo SQL de sessão para atender aos seus próprios requisitos.

Os modos afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados.

Para mais informações sobre a configuração do modo SQL, veja a Seção 7.1.11, “Modos SQL do Servidor”.

### Executando o MySQL no Modo ANSI

Para executar o MySQL Server no modo ANSI, inicie o **mysqld** com a opção `--ansi`. Executar o servidor no modo ANSI é o mesmo que iniciá-lo com as seguintes opções:

```
--transaction-isolation=SERIALIZABLE --sql-mode=ANSI
```

Para obter o mesmo efeito em tempo de execução, execute essas duas instruções:

```
SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET GLOBAL sql_mode = 'ANSI';
```

Você pode ver que definir a variável de sistema `sql_mode` para `'ANSI'` habilita todas as opções de modo SQL relevantes para o modo ANSI da seguinte forma:

```
mysql> SET GLOBAL sql_mode='ANSI';
mysql> SELECT @@GLOBAL.sql_mode;
        -> 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ANSI'
```

Executar o servidor no modo ANSI com `--ansi` não é exatamente o mesmo que definir o modo SQL para `'ANSI'`, pois a opção `--ansi` também define o nível de isolamento de transação.

Veja a Seção 7.1.7, “Opções de comando do servidor”.