#### 13.6.7.9 Restrições no Tratamento de Condições

[`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement"), [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") e [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") não são permitidos como prepared statements. Por exemplo, esta instrução é inválida:

```sql
PREPARE stmt1 FROM 'SIGNAL SQLSTATE "02000"';
```

Valores `SQLSTATE` na classe `'04'` não são tratados de forma especial. Eles são manipulados da mesma forma que outras exceptions.

No SQL padrão, a primeira condition se relaciona ao valor `SQLSTATE` retornado para o SQL statement anterior. No MySQL, isso não é garantido, então para obter o error principal, você não pode fazer isto:

```sql
GET DIAGNOSTICS CONDITION 1 @errno = MYSQL_ERRNO;
```

Em vez disso, faça o seguinte:

```sql
GET DIAGNOSTICS @cno = NUMBER;
GET DIAGNOSTICS CONDITION @cno @errno = MYSQL_ERRNO;
```