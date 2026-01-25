### 2.8.9 Configuração do MySQL e Ferramentas de Terceiros

Ferramentas de terceiros que precisam determinar a versão do MySQL a partir do código-fonte (source) do MySQL podem ler o arquivo `VERSION` no diretório raiz do código-fonte (*top-level source directory*). O arquivo lista as partes da versão separadamente. Por exemplo, se a versão for MySQL 5.7.4-m14, o arquivo será semelhante a este:

```sql
MYSQL_VERSION_MAJOR=5
MYSQL_VERSION_MINOR=7
MYSQL_VERSION_PATCH=4
MYSQL_VERSION_EXTRA=-m14
```

Se o código-fonte não for referente a um lançamento General Availability (GA) do MySQL Server, o valor de `MYSQL_VERSION_EXTRA` não estará vazio. No exemplo precedente, o valor corresponde ao Milestone 14.

`MYSQL_VERSION_EXTRA` também não estará vazio para lançamentos do NDB Cluster (incluindo lançamentos GA do NDB Cluster), conforme mostrado aqui:

```sql
MYSQL_VERSION_MAJOR=5
MYSQL_VERSION_MINOR=7
MYSQL_VERSION_PATCH=32
MYSQL_VERSION_EXTRA=-ndb-7.5.21
```

Para construir um número de cinco dígitos a partir dos componentes da versão, utilize esta fórmula:

```sql
MYSQL_VERSION_MAJOR*10000 + MYSQL_VERSION_MINOR*100 + MYSQL_VERSION_PATCH
```