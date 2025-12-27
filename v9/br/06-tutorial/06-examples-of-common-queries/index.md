## 5.6 Exemplos de Perguntas Comuns

5.6.1 O Valor Máximo de uma Coluna

5.6.2 A Linha que Contém o Valor Máximo de uma Certa Coluna

5.6.3 Máximo de Coluna por Grupo

5.6.4 As Linhas que Contêm o Máximo por Grupo de uma Certa Coluna

5.6.5 Uso de Variáveis Definidas pelo Usuário

5.6.6 Uso de Chaves Estrangeiras

5.6.7 Busca em Duas Chaves

5.6.8 Cálculo de Visitas por Dia

5.6.9 Uso de AUTO_INCREMENT

Aqui estão exemplos de como resolver alguns problemas comuns com o MySQL.

Alguns dos exemplos usam a tabela `shop` para armazenar o preço de cada artigo (número do item) para certos comerciantes (distribuidores). Supondo que cada comerciante tenha um único preço fixo por artigo, então (`article`, `dealer`) é uma chave primária para os registros.

Inicie a ferramenta de linha de comando **mysql** e selecione um banco de dados:

```
$> mysql your-database-name
```

Para criar e popolar a tabela de exemplo, use estas instruções:

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

Após emitir as instruções, a tabela deve ter o seguinte conteúdo:

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