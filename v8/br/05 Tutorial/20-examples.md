## 5.6 Exemplos de perguntas comuns

Aqui estão exemplos de como resolver alguns problemas comuns com o MySQL.

Alguns dos exemplos usam a tabela `shop` para manter o preço de cada artigo (número de item) para certos comerciantes (revendedores).

Inicie a ferramenta de linha de comando `mysql` e selecione um banco de dados:

```
$> mysql your-database-name
```

Para criar e preencher a tabela de exemplo, use estas instruções:

```
CREATE TABLE shop (
    article INT UNSIGNED  DEFAULT '0000' NOT NULL,
    dealer  CHAR(20)      DEFAULT ''     NOT NULL,
    price   DECIMAL(16,2) DEFAULT '0.00' NOT NULL,
    PRIMARY KEY(article, dealer));
INSERT INTO shop VALUES
    (1,'A',3.45),(1,'B',3.99),(2,'A',10.99),(3,'B',1.45),
    (3,'C',1.69),(3,'D',1.25),(4,'D',19.95);
```

Após a emissão das declarações, o quadro deve ter o seguinte conteúdo:

```
SELECT * FROM shop ORDER BY article;

+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|       1 | A      |  3.45 |
|       1 | B      |  3.99 |
|       2 | A      | 10.99 |
|       3 | B      |  1.45 |
|       3 | C      |  1.69 |
|       3 | D      |  1.25 |
|       4 | D      | 19.95 |
+---------+--------+-------+
```
