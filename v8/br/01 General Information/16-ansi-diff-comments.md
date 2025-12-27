#### 1.7.2.4 `'--'` como início de um comentário

O SQL padrão utiliza a sintaxe C `/* este é um comentário */` para comentários, e o MySQL Server também suporta essa sintaxe. O MySQL também suporta extensões a essa sintaxe que permitem a incorporação de SQL específico do MySQL no comentário; consulte a Seção 11.7, “Comentários”.

O MySQL Server também usa `#` como caractere de início de comentário. Isso não é padrão.

O SQL padrão também usa “`--`” como uma sequência de início de comentário. O MySQL Server suporta uma variante do estilo de comentário `--`; a sequência de início de comentário `--` é aceita como tal, mas deve ser seguida por um caractere de espaço, como um espaço ou uma nova linha. O espaço é destinado a evitar problemas com consultas SQL geradas que usam construções como as seguintes, que atualizam o saldo para refletir uma cobrança:

```sql
UPDATE account SET balance=balance-charge
WHERE account_id=user_id
```

Considere o que acontece quando `charge` tem um valor negativo, como `-1`, o que pode ser o caso quando um valor é creditado na conta. Neste caso, a declaração gerada parece assim:

```sql
UPDATE account SET balance=balance--1
WHERE account_id=5752;
```

`balance--1` é um SQL padrão válido, mas `--` é interpretado como o início de um comentário, e parte da expressão é descartada. O resultado é uma declaração que tem um significado completamente diferente do pretendido:

```sql
UPDATE account SET balance=balance
WHERE account_id=5752;
```

Esta declaração não produz nenhuma mudança no valor. Para evitar isso, o MySQL requer um caractere de espaço após o `--` para que ele seja reconhecido como uma sequência de início de comentário no MySQL Server, para que uma expressão como `balance--1` seja sempre segura para uso.