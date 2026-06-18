## 10.3 Especificando Character Sets e Collations

10.3.1 Convenções de Nomenclatura de Collation

10.3.2 Character Set e Collation do Server

10.3.3 Character Set e Collation do Database

10.3.4 Character Set e Collation da Tabela

10.3.5 Character Set e Collation da Coluna

10.3.6 Character Set e Collation de String Literal de Caracteres

10.3.7 O Character Set Nacional

10.3.8 Introducers de Character Set

10.3.9 Exemplos de Atribuição de Character Set e Collation

10.3.10 Compatibilidade com Outros DBMSs

Existem configurações default (padrão) para character sets e collations em quatro níveis: server, database, tabela e coluna. A descrição nas seções a seguir pode parecer complexa, mas na prática, descobriu-se que o uso de defaults em múltiplos níveis leva a resultados naturais e óbvios.

`CHARACTER SET` é usado em cláusulas que especificam um character set. `CHARSET` pode ser usado como um sinônimo para `CHARACTER SET`.

Questões de character set afetam não apenas o armazenamento de dados, mas também a comunicação entre programas client e o server MySQL. Se você deseja que o programa client se comunique com o server usando um character set diferente do default, você precisará indicar qual. Por exemplo, para usar o character set Unicode `utf8`, execute este statement após se conectar ao server:

```sql
SET NAMES 'utf8';
```

Para mais informações sobre questões relacionadas a character set na comunicação client/server, consulte a Seção 10.4, “Connection Character Sets and Collations”.