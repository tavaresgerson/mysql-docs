#### 13.6.7.9 Restrições para o manuseio de condições

``SIGNAL`, ``RESIGNAL` e `[`GET DIAGNOSTICS\`]\(get-diagnostics.html) não são permitidos como instruções preparadas. Por exemplo, esta instrução é inválida:

```sql
PREPARE stmt1 FROM 'SIGNAL SQLSTATE "02000"';
```

Os valores `SQLSTATE` na classe `'04'` não são tratados de forma especial. Eles são tratados da mesma forma que outras exceções.

No SQL padrão, a primeira condição está relacionada ao valor `SQLSTATE` retornado para a instrução SQL anterior. No MySQL, isso não é garantido, então para obter o erro principal, você não pode fazer isso:

```sql
GET DIAGNOSTICS CONDITION 1 @errno = MYSQL_ERRNO;
```

Em vez disso, faça isso:

```sql
GET DIAGNOSTICS @cno = NUMBER;
GET DIAGNOSTICS CONDITION @cno @errno = MYSQL_ERRNO;
```
