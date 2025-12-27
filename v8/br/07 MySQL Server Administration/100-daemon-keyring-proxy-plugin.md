### 7.6.8 O Plugin de Ponte Proxy do Keyring

O Keyring MySQL originalmente implementou as capacidades de keystore usando plugins do servidor, mas começou a migrar para usar a infraestrutura de componentes no MySQL 8.0. A transição inclui a revisão da implementação subjacente dos plugins de keyring para usar a infraestrutura de componentes. Isso é facilitado usando o plugin chamado `daemon_keyring_proxy_plugin`, que atua como uma ponte entre as APIs do serviço de componente e do plugin, e permite que os plugins de keyring continuem a ser usados sem alterações nas características visíveis para o usuário.

O `daemon_keyring_proxy_plugin` é integrado e não é necessário fazer nada para instalá-lo ou habilitá-lo.