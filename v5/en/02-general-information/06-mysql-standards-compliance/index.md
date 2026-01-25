## 1.6 Conformidade com Padrões MySQL

1.6.1 Extensões MySQL para o SQL Padrão

1.6.2 Diferenças do MySQL em Relação ao SQL Padrão

1.6.3 Como o MySQL Lida com Constraints

Esta seção descreve como o MySQL se relaciona com os padrões SQL ANSI/ISO. O MySQL Server possui muitas extensões para o padrão SQL e aqui você pode descobrir quais são e como usá-las. Você também pode encontrar informações sobre funcionalidades ausentes no MySQL Server e como contornar algumas das diferenças.

O padrão SQL tem evoluído desde 1986 e diversas versões existem. Neste manual, “SQL-92” refere-se ao padrão lançado em 1992. “SQL:1999”, “SQL:2003”, “SQL:2008” e “SQL:2011” referem-se às versões do padrão lançadas nos anos correspondentes, sendo a última a versão mais recente. Usamos a frase “o padrão SQL” ou “SQL padrão” para significar a versão atual do SQL Standard em qualquer momento.

Um dos nossos principais objetivos com o produto é continuar trabalhando em direção à conformidade com o padrão SQL, mas sem sacrificar a velocidade ou a confiabilidade. Não temos receio de adicionar extensões ao SQL ou suporte para recursos não-SQL se isso aumentar significativamente a usabilidade do MySQL Server para um grande segmento da nossa base de usuários. A interface `HANDLER` é um exemplo dessa estratégia. Consulte a Seção 13.2.4, “Comando HANDLER”.

Continuamos a oferecer suporte a Databases transacionais e não transacionais para satisfazer tanto o uso de missão crítica 24/7 quanto o uso intenso de Web ou logging.

O MySQL Server foi originalmente projetado para funcionar com Databases de tamanho médio (10 a 100 milhões de linhas, ou cerca de 100MB por tabela) em pequenos sistemas de computador. Hoje, o MySQL Server lida com Databases de tamanho terabyte, mas o código também pode ser compilado em uma versão reduzida adequada para dispositivos portáteis e embarcados (embedded devices). O design compacto do MySQL Server torna o desenvolvimento em ambas as direções possível sem conflitos na árvore de código-fonte.

Não estamos visando suporte em tempo real, embora os recursos de replicação do MySQL ofereçam funcionalidade significativa.

O MySQL suporta os níveis ODBC de 0 a 3.51.

O MySQL suporta clustering de Database de alta disponibilidade usando o storage engine `NDBCLUSTER`. Consulte o Capítulo 21, *MySQL NDB Cluster 7.5 e NDB Cluster 7.6*.

Implementamos funcionalidade XML que suporta a maior parte do padrão W3C XPath. Consulte a Seção 12.11, “Funções XML”.

O MySQL (5.7.8 e posterior) suporta um tipo de dado (data type) JSON nativo conforme definido pelo RFC 7159 e baseado no padrão ECMAScript (ECMA-262). Consulte a Seção 11.5, “O Data Type JSON”. O MySQL também implementa um subconjunto das funções SQL/JSON especificadas por um rascunho de pré-publicação do padrão SQL:2016; consulte a Seção 12.17, “Funções JSON”, para obter mais informações.

### Selecionando SQL Modes

O servidor MySQL pode operar em diferentes SQL Modes, e pode aplicar esses Modes de forma diferente para clientes distintos, dependendo do valor da variável de sistema `sql_mode`. DBAs podem definir o SQL Mode global para corresponder aos requisitos operacionais do servidor do site, e cada aplicação pode definir seu SQL Mode de sessão para seus próprios requisitos.

Os Modes afetam a sintaxe SQL que o MySQL suporta e as verificações de validação de dados que ele realiza. Isso torna mais fácil usar o MySQL em diferentes ambientes e utilizá-lo em conjunto com outros servidores Database.

Para mais informações sobre como definir o SQL Mode, consulte a Seção 5.1.10, “SQL Modes do Servidor”.

### Executando MySQL em ANSI Mode

Para executar o MySQL Server em ANSI Mode, inicie o **mysqld** com a opção `--ansi`. Executar o servidor em ANSI Mode é o mesmo que iniciá-lo com as seguintes opções:

```sql
--transaction-isolation=SERIALIZABLE --sql-mode=ANSI
```

Para alcançar o mesmo efeito em tempo de execução (runtime), execute estas duas instruções:

```sql
SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET GLOBAL sql_mode = 'ANSI';
```

Você pode ver que definir a variável de sistema `sql_mode` como `'ANSI'` habilita todas as opções de SQL Mode que são relevantes para o ANSI Mode, da seguinte forma:

```sql
mysql> SET GLOBAL sql_mode='ANSI';
mysql> SELECT @@GLOBAL.sql_mode;
        -> 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ANSI'
```

Executar o servidor em ANSI Mode com `--ansi` não é exatamente o mesmo que definir o SQL Mode para `'ANSI'`, porque a opção `--ansi` também define o nível de isolation level da Transaction.

Consulte a Seção 5.1.6, “Opções de Comando do Servidor”.