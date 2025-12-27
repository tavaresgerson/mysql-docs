## 12.3 Especificação de Conjuntos de Caracteres e Colagens

Existem configurações padrão para conjuntos de caracteres e colagens em quatro níveis: servidor, banco de dados, tabela e coluna. A descrição nas seções a seguir pode parecer complexa, mas na prática, a definição padrão em vários níveis resulta em resultados naturais e óbvios.

`CHARACTER SET` é usado em cláusulas que especificam um conjunto de caracteres. `CHARSET` pode ser usado como sinônimo de `CHARACTER SET`.

Problemas com conjuntos de caracteres afetam não apenas o armazenamento de dados, mas também a comunicação entre programas cliente e o servidor MySQL. Se você deseja que o programa cliente se comunique com o servidor usando um conjunto de caracteres diferente do padrão, é necessário indicar qual é. Por exemplo, para usar o conjunto de caracteres Unicode `latin1`, execute esta declaração após se conectar ao servidor:

```
SET NAMES 'latin1';
```

Para obter mais informações sobre problemas relacionados a conjuntos de caracteres na comunicação cliente/servidor, consulte a Seção 12.4, “Conjunto de Caracteres e Colagens de Conexão”.