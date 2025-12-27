#### 20.7.9.1 Habilitar ou desabilitar a instrumentação de replicação de grupo

Para habilitar todas as ferramentas de instrumentação de replicação de grupo a partir da linha de comando, execute o seguinte no cliente SQL de sua escolha:

```
        UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
        WHERE NAME LIKE 'memory/group_rpl/%';
```

Para desabilitar todas as ferramentas de instrumentação de replicação de grupo a partir da linha de comando, execute o seguinte no cliente SQL de sua escolha:

```
        UPDATE performance_schema.setup_instruments SET ENABLED = 'NO'
        WHERE NAME LIKE 'memory/group_rpl/%';
```

Para habilitar todas as ferramentas de instrumentação de replicação de grupo no início do servidor, adicione o seguinte ao seu arquivo de opções:

```
        [mysqld]
        performance-schema-instrument='memory/group_rpl/%=ON'
```

Para desabilitar todas as ferramentas de instrumentação de replicação de grupo no início do servidor, adicione o seguinte ao seu arquivo de opções:

```
        [mysqld]
        performance-schema-instrument='memory/group_rpl/%=OFF'
```

Para habilitar ou desabilitar instrumentos individuais nesse grupo, substitua o caractere de asterisco (%) pelo nome completo do instrumento.

Para obter mais informações, consulte a Seção 29.3, “Configuração de inicialização do Schema de Desempenho” e a Seção 29.4, “Configuração de execução do Schema de Desempenho”.