### 2.8.9 Configuração do MySQL e Ferramentas de Terceiros

Ferramentas de terceiros que precisam determinar a versão do MySQL a partir da fonte do MySQL podem ler o arquivo `MYSQL_VERSION` no diretório de origem de nível superior. O arquivo lista as peças da versão separadamente. Por exemplo, se a versão é o MySQL 8.4.0, o arquivo parece assim:

```
MYSQL_VERSION_MAJOR=8
MYSQL_VERSION_MINOR=4
MYSQL_VERSION_PATCH=0
MYSQL_VERSION_EXTRA="INNOVATION"
```

Para construir um número de cinco dígitos a partir dos componentes da versão, utilizar a seguinte fórmula:

```
MYSQL_VERSION_MAJOR*10000 + MYSQL_VERSION_MINOR*100 + MYSQL_VERSION_PATCH
```
