### 2.8.9 Configuração do MySQL e Ferramentas de Terceiros

Ferramentas de terceiros que precisam determinar a versão do MySQL a partir da fonte do MySQL podem ler o arquivo `VERSION` no diretório de origem de nível superior. O arquivo lista as partes da versão separadamente. Por exemplo, se a versão for MySQL 5.7.4-m14, o arquivo ficará assim:

```bash
MYSQL_VERSION_MAJOR=5
MYSQL_VERSION_MINOR=7
MYSQL_VERSION_PATCH=4
MYSQL_VERSION_EXTRA=-m14
```

Se a fonte não for para uma versão de disponibilidade geral (GA) do MySQL Server, o valor `MYSQL_VERSION_EXTRA` não está vazio. No exemplo anterior, o valor corresponde ao Milestone 14.

`MYSQL_VERSION_EXTRA` também não está vazio para as versões do NDB Cluster (incluindo as versões GA do NDB Cluster), como mostrado aqui:

```bash
MYSQL_VERSION_MAJOR=5
MYSQL_VERSION_MINOR=7
MYSQL_VERSION_PATCH=32
MYSQL_VERSION_EXTRA=-ndb-7.5.21
```

Para construir um número de cinco dígitos a partir dos componentes da versão, use esta fórmula:

```bash
MYSQL_VERSION_MAJOR*10000 + MYSQL_VERSION_MINOR*100 + MYSQL_VERSION_PATCH
```
