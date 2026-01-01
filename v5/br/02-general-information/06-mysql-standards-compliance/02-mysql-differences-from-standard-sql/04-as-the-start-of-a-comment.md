#### 1.6.2.4 '--' como início de um comentário

O SQL padrão usa a sintaxe C `/* this is a comment */` para comentários, e o MySQL Server também suporta essa sintaxe. O MySQL também suporta extensões dessa sintaxe que permitem que o SQL específico do MySQL seja incorporado no comentário; veja a Seção 9.6, “Comentários”.

O MySQL Server também usa `#` como caractere de comentário inicial. Isso não é padrão.

O SQL padrão também usa `--` como uma sequência de comentário de início. O MySQL Server suporta uma variante do estilo de comentário `--`; a sequência de comentário de início `--` é aceita como tal, mas deve ser seguida por um caractere de espaço em branco, como um espaço ou uma nova linha. O espaço é destinado a evitar problemas com consultas SQL geradas que utilizam construções como as seguintes, que atualizam o saldo para refletir uma cobrança:

```sql
UPDATE account SET balance=balance-charge
WHERE account_id=user_id
```

Considere o que acontece quando a coluna `charge` tem um valor negativo, como `-1`, o que pode ocorrer quando um valor é creditado na conta. Nesse caso, a declaração gerada ficaria assim:

```sql
UPDATE account SET balance=balance--1
WHERE account_id=5752;
```

`balance--1` é uma sintaxe SQL padrão válida, mas `--` é interpretado como o início de um comentário, e parte da expressão é descartada. O resultado é uma declaração que tem um significado completamente diferente do pretendido:

```sql
UPDATE account SET balance=balance
WHERE account_id=5752;
```

Essa declaração não produz nenhuma alteração no valor. Para evitar isso, o MySQL exige um caractere de espaço em branco após o `--` para que ele seja reconhecido como uma sequência de comentário inicial no MySQL Server, para que uma expressão como `balance--1` possa ser usada com segurança.
