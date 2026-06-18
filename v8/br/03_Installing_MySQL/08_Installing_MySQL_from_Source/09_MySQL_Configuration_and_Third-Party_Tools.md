### 2.8.9 Configuração do MySQL e Ferramentas de Terceiros

Ferramentas de terceiros que precisam determinar a versão do MySQL a partir da fonte do MySQL podem ler o arquivo `MYSQL_VERSION` no diretório de origem de nível superior. O arquivo lista as partes da versão separadamente. Por exemplo, se a versão for MySQL 8.0.36, o arquivo ficará assim:

```
MYSQL_VERSION_MAJOR=8
MYSQL_VERSION_MINOR=0
MYSQL_VERSION_PATCH=36
MYSQL_VERSION_EXTRA=
MYSQL_VERSION_STABILITY="LTS"
```

Nota

No MySQL 5.7 e versões anteriores, esse arquivo era chamado de `VERSION`.

Para construir um número de cinco dígitos a partir dos componentes da versão, use esta fórmula:

```
MYSQL_VERSION_MAJOR*10000 + MYSQL_VERSION_MINOR*100 + MYSQL_VERSION_PATCH
```
