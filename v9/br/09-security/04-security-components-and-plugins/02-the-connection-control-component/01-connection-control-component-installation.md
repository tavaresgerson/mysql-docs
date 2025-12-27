#### 8.4.2.1 Instalação do Componente de Controle de Conexão

O Componente de Controle de Conexão está disponível nas distribuições Community e Enterprise do MySQL. O componente pode ser instalado em um servidor MySQL em execução usando a instrução `INSTALL COMPONENT` mostrada aqui:

```
mysql> INSTALL COMPONENT 'file://component_connection_control';
Query OK, 0 rows affected (0.01 sec)
```

Para verificar se o componente foi instalado com sucesso, você pode consultar a tabela `mysql.component` da seguinte maneira:

```
mysql> SELECT * FROM mysql.component
    -> WHERE component_urn LIKE '%connection%';
+--------------+--------------------+-------------------------------------+
| component_id | component_group_id | component_urn                       |
+--------------+--------------------+-------------------------------------+
|           16 |                 12 | file://component_connection_control |
+--------------+--------------------+-------------------------------------+
1 row in set (0.00 sec)
```

Não são necessários passos adicionais para instalar e executar o componente. Embora ele possa ser usado com as configurações padrão, você pode querer ajustar suas operações para atender às condições específicas do seu ambiente. A próxima seção, Seção 8.4.2.2, “Configuração do Componente de Controle de Conexão”, fornece informações sobre como realizar essa tarefa.

Veja também a Seção 7.5.1, “Instalando e Desinstalando Componentes”.