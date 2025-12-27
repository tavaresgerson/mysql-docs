### 15.6.8 Restrições para o tratamento de condições

`SIGNAL`, `RESIGNAL` e `GET DIAGNOSTICS` não são permitidos como instruções preparadas. Por exemplo, esta instrução é inválida:

```
PREPARE stmt1 FROM 'SIGNAL SQLSTATE "02000"';
```

Os valores `SQLSTATE` da classe `'04'` não são tratados de forma especial. Eles são tratados da mesma forma que outras exceções.

No SQL padrão, a primeira condição se relaciona ao valor `SQLSTATE` retornado para a instrução SQL anterior. No MySQL, isso não é garantido, então para obter o erro principal, você não pode fazer isso:

```
GET DIAGNOSTICS CONDITION 1 @errno = MYSQL_ERRNO;
```

Em vez disso, faça isso:

```
GET DIAGNOSTICS @cno = NUMBER;
GET DIAGNOSTICS CONDITION @cno @errno = MYSQL_ERRNO;
```