#### 20.7.9.1 Habilitar ou desabilitar a instrumentação de replicação em grupo

Para habilitar todas as ferramentas de replicação de grupo a partir da linha de comando, execute o seguinte no cliente SQL de sua escolha:

```
        UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
        WHERE NAME LIKE 'memory/group_rpl/%';
```

Para desabilitar toda a instrumentação de replicação de grupo a partir da linha de comando, execute o seguinte no cliente SQL de sua escolha:

```
        UPDATE performance_schema.setup_instruments SET ENABLED = 'NO'
        WHERE NAME LIKE 'memory/group_rpl/%';
```

Para habilitar toda a instrumentação de replicação de grupo na inicialização do servidor, adicione o seguinte ao seu arquivo de opções:

```
        [mysqld]
        performance-schema-instrument='memory/group_rpl/%=ON'
```

Para desabilitar toda a instrumentação de replicação de grupo na inicialização do servidor, adicione o seguinte ao seu arquivo de opções:

```
        [mysqld]
        performance-schema-instrument='memory/group_rpl/%=OFF'
```

Para habilitar ou desabilitar instrumentos individuais nesse grupo, substitua o caractere de asterisco (%) pelo nome completo do instrumento.

Para obter mais informações, consulte a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho” e a Seção 29.4, “Configuração de Execução do Schema de Desempenho”.
