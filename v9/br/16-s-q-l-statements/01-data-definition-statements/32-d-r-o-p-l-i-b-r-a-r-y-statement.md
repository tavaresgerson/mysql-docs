### 15.1.32 Declaração DROP LIBRARY

```
DROP LIBRARY [IF EXISTS] [database.]library
```

Desativa a biblioteca JavaScript nomeada. Um nome de banco de dados opcional pode ser especificado; caso contrário, o banco de dados atual é assumido.

Para executar esta declaração, o usuário deve ter o privilégio `ALTER ROUTINE`. Uma biblioteca criada por um usuário com o privilégio `SYSTEM_USER` pode ser desativada apenas por um usuário que tenha o mesmo privilégio.

Consulte a Seção 27.3.8, “Usando Bibliotecas JavaScript”, para obter mais informações e exemplos.